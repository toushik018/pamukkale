import { jsPDF } from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';
import { CheckoutFormData } from '@/components/Checkout/CheckoutForm';
import loadImageAsBase64 from '@/utils/loadImageInPdf';
import { getPackageMenuId } from '@/utils/menuUtils';
import { getMenuContents } from '@/constants/categories';

interface Product {
    name: string;
    quantity: string;
    price: number;
    total: number;
}

interface Package {
    package: string;
    price: number;
    products: {
        [key: string]: Array<{
            name: string;
            quantity: string;
            price: number;
            total: number;
        }>;
    };
    guests?: number;
    date?: string;
    time?: string;
}

interface MenuContent {
    name: string;
    ids: number[];
    count: number;
}

interface Menu {
    name: string;
    id: number;
    price: number;
    contents: MenuContent[];
}

interface GeneratePDFProps {
    orderData: {
        packages: Package[];
        totalPrice: string;
        menu?: Menu;
        deliveryFee?: number;
    };
    customerInfo: CheckoutFormData;
    orderNumber: string;
}

export const generateOrderPDF = async ({
    orderData,
    customerInfo,
    orderNumber,
}: GeneratePDFProps) => {
    const doc = new jsPDF();

    // Set global text color
    doc.setTextColor(33, 37, 41);

    try {
        const base64Logo = await loadImageAsBase64('/logos/logo.png');
        doc.addImage(base64Logo, 'PNG', 15, 10, 20, 10);
    } catch (error) {
        console.error('Error adding logo to PDF:', error);
    }

    // Header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Hardal Restaurant', 40, 15);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Catering-Auftrag', 40, 20);

    // Order Number & Date
    doc.setFontSize(10);
    doc.text(`Bestellnummer: ${orderNumber}`, 15, 30);
    doc.text(`Datum: ${new Date().toLocaleDateString('de-DE')}`, 15, 35);

    // Customer Information
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Kundeninformationen', 20, 46);
    doc.setFont('helvetica', 'normal');
    doc.text(
        [
            `${customerInfo.firstName} ${customerInfo.lastName}`,
            customerInfo.address,
            `${customerInfo.postalCode} ${customerInfo.city}`,
            `Tel: ${customerInfo.phone}`,
            `Email: ${customerInfo.email}`,
        ],
        20,
        52,
        { lineHeightFactor: 1.2 }
    );

    // Order Details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Bestelldetails', 15, 80);

    const tableData: RowInput[] = [];
    let calculatedSubTotal = 0;
    let extrasTotal = 0;

    // Process each package
    if (Array.isArray(orderData.packages)) {
        orderData.packages.forEach((pkg, index) => {
            // Base package price = package price * number of guests
            const basePackagePrice = pkg.price * (pkg.guests || 1);
            let productsOver10Total = 0;

            // Format date with month name
            const formatDate = (dateStr: string) => {
                const date = new Date(dateStr);
                const day = date.getDate();
                const month = date.toLocaleString('de-DE', { month: 'long' });
                const year = date.getFullYear();
                return `${day} ${month} ${year}`;
            };

            // Add package header
            tableData.push([
                {
                    content: `${pkg.package}${pkg.guests ? ` (${pkg.guests} Gäste)` : ''}${pkg.date && pkg.time
                        ? `\nDatum: ${formatDate(pkg.date)} - Uhrzeit: ${pkg.time} Uhr`
                        : ''
                        }`,
                    colSpan: 2,
                    styles: {
                        fontStyle: 'bold',
                        fillColor: [240, 240, 240],
                        textColor: [33, 37, 41],
                        fontSize: 11
                    },
                },
                {
                    content: `${pkg.price}€`,
                    styles: {
                        fontStyle: 'bold',
                        fillColor: [240, 240, 240],
                        textColor: [33, 37, 41],
                        halign: 'right',
                        fontSize: 11
                    },
                },
            ]);

            // Get menu contents either from API or fallback
            const menuId = getPackageMenuId(pkg.package);
            const menuContents =
                orderData.menu?.contents ||
                (menuId ? getMenuContents(menuId) : []);

            // Get extra category IDs
            const extraIds = menuContents?.find(
                content => content.name === "Extras"
            )?.ids || ["63", "66", "69"];

            // Process products
            if (pkg.products) {
                // Group products by category
                const groupedProducts: { [key: string]: Array<Product> } = {};

                Object.entries(pkg.products).forEach(([categoryId, products]) => {
                    if (Array.isArray(products)) {
                        // Get category name from menu contents
                        let categoryName = "Andere";
                        const category = menuContents?.find((content) =>
                            content.ids.includes(parseInt(categoryId))
                        );
                        if (category?.name) {
                            categoryName = category.name;
                        }

                        // Initialize category array if needed
                        if (!groupedProducts[categoryName]) {
                            groupedProducts[categoryName] = [];
                        }

                        products.forEach((product) => {
                            // Calculate totals
                            const quantity = Number(product.quantity);
                            if (quantity >= 10 && quantity % 10 === 0 && product.price > 0) {
                                productsOver10Total += product.total;
                            }
                            // Add to extras total if in extra categories and not ≥10
                            else if (extraIds.includes(parseInt(categoryId) as never)) {
                                extrasTotal += product.total || 0;
                            }

                            // Add to grouped products for display
                            groupedProducts[categoryName].push(product);
                        });
                    }
                });

                // Add products to table by category
                Object.entries(groupedProducts).forEach(([categoryName, products]) => {
                    // Add category header
                    tableData.push([
                        {
                            content: categoryName,
                            colSpan: 3,
                            styles: {
                                fontStyle: 'bold',
                                fillColor: [255, 244, 231],
                                fontSize: 10,
                                textColor: [33, 37, 41]
                            },
                        },
                    ]);

                    // Add products in this category
                    products.forEach((product) => {
                        const price = product.total > 0 ? `${product.total}€` : `${product.price}€`;
                        tableData.push([product.name, product.quantity, price]);
                    });
                });
            }

            // Calculate package total (base price + products ≥10)
            const packageTotal = basePackagePrice + productsOver10Total;
            calculatedSubTotal += packageTotal;

            // Add package subtotal
            tableData.push([
                {
                    content: `Zwischensumme`,
                    colSpan: 2,
                    styles: {
                        fontStyle: 'bold',
                        fillColor: [245, 245, 245],
                        fontSize: 10
                    },
                },
                {
                    content: `${packageTotal.toFixed(2)}€`,
                    styles: {
                        fontStyle: 'bold',
                        fillColor: [245, 245, 245],
                        halign: 'right',
                        fontSize: 10
                    },
                },
            ]);

            // Add a small separator between packages (smaller spacing)
            if (index < orderData.packages.length - 1) {
                tableData.push([
                    {
                        content: '',
                        colSpan: 3,
                        styles: {
                            minCellHeight: 1,  // Reduced from 3 to 1
                            fillColor: [255, 255, 255]
                        }
                    }
                ]);
            }
        });
    }

    // Add table with improved styling
    autoTable(doc, {
        startY: 85,
        head: [['Artikel', 'Menge', 'Preis']],
        body: tableData,
        theme: 'plain',
        styles: {
            fontSize: 9,
            cellPadding: { top: 2, right: 3, bottom: 2, left: 3 },
            overflow: 'linebreak',
            cellWidth: 'wrap',
            valign: 'middle',
            lineColor: [220, 220, 220],
            lineWidth: 0.1,
        },
        headStyles: {
            fillColor: [252, 200, 26],
            textColor: [33, 37, 41],
            fontStyle: 'bold',
            fontSize: 10,
            cellPadding: { top: 3, right: 3, bottom: 3, left: 3 },
        },
        columnStyles: {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 20, halign: 'center' },
            2: { cellWidth: 30, halign: 'right' },
        },
        margin: { top: 85, bottom: 25 },
        didParseCell: function (data) {
            const row = data.row.raw as Array<{ content?: string }>;
            if (Array.isArray(row) && row[0] && typeof row[0] === 'object') {
                const isPackageHeader = data.row.index === 0 ||
                    (data.row.index > 0 &&
                        row[0].content &&
                        (row[0].content.includes('Menü') || row[0].content.includes('Menu')));

                if (isPackageHeader) {
                    data.cell.styles.fillColor = [240, 240, 240];
                    data.cell.styles.textColor = [33, 37, 41];
                    data.cell.styles.fontSize = 11;
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        },
        // Improve table layout
        willDrawCell: function (data) {
            // Remove borders from spacer rows
            const row = data.row.raw as Array<{ content?: string }>;
            if (row?.[0] && typeof row[0] === 'object' && 'content' in row[0] && row[0].content === '') {
                data.cell.styles.lineWidth = 0;
            }
        },
        // Ensure continuous table look
        didDrawPage: function (data) {
            // Reset top margin for better table continuation between pages
            data.settings.margin.top = 20;
        }
    });

    // Get final Y position after the table
    const finalY = (doc as any).lastAutoTable.finalY + 5;

    // Calculate how much space we need for the totals section
    // Added 10px buffer to ensure no overlap
    const totalsHeight = orderData.deliveryFee ? 36 : 29;
    const footerHeight = 15; // Space needed for footer
    const pageHeight = doc.internal.pageSize.height;
    const availableSpace = pageHeight - finalY - footerHeight;

    // Check if we need to add a new page for totals
    if (availableSpace < totalsHeight) {
        doc.addPage();
        // Reset position to top of new page with some margin
        const newPageY = 20;
        addTotalsSection(doc, newPageY, calculatedSubTotal, extrasTotal, orderData.deliveryFee);
    } else {
        // Add totals to current page
        addTotalsSection(doc, finalY, calculatedSubTotal, extrasTotal, orderData.deliveryFee);
    }

    // Add footer to only the current/last page
    addFooter(doc);

    return doc;
};

// Function to add the totals section
function addTotalsSection(doc: jsPDF, startY: number, calculatedSubTotal: number, extrasTotal: number, deliveryFee?: number) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(33, 37, 41);

    // Show subtotal
    doc.text(`Zwischensumme: ${calculatedSubTotal.toFixed(2)}€`, 20, startY + 5.5);
    // Show extras total
    doc.text(`Extras: ${extrasTotal.toFixed(2)}€`, 20, startY + 12.5);
    // Show delivery fee if present
    if (deliveryFee) {
        doc.text(`Liefergebühr: ${deliveryFee.toFixed(2)}€`, 20, startY + 19.5);
        // Show final total with delivery fee
        doc.text(`Gesamtbetrag: ${(calculatedSubTotal + extrasTotal + deliveryFee).toFixed(2)}€`, 20, startY + 26.5);
    } else {
        // Show final total without delivery fee
        doc.text(`Gesamtbetrag: ${(calculatedSubTotal + extrasTotal).toFixed(2)}€`, 20, startY + 19.5);
    }
}

// Function to add the footer
function addFooter(doc: jsPDF) {
    const footerY = doc.internal.pageSize.height - 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Hardal Restaurant | Möllner Landstraße 3, 22111 Hamburg | Tel: +49 408 470 82 | Email: info@hardal-restaurant.de', doc.internal.pageSize.width / 2, footerY, { align: 'center' });
}
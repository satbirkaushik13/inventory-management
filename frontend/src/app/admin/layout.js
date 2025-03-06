import "bootstrap/dist/css/bootstrap.min.css";
export default function AdminLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <main>{children}</main>
            </body>
        </html>
    );
}
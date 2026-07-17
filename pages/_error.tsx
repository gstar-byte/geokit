import Head from "next/head";
import Link from "next/link";

function CustomError({ statusCode }: { statusCode?: number }) {
  const title = statusCode
    ? `${statusCode} - Page Not Found | GEOKit`
    : "An Error Occurred | GEOKit";
  const description = statusCode === 404
    ? "The requested page could not be found."
    : "An unexpected error occurred.";

  return (
    <html lang="en">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body className="min-h-screen bg-gray-950 text-white flex flex-col">
        <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-brand-500/10 text-brand-400 mb-6 border border-brand-500/20 text-3xl font-bold">
            {statusCode || "Err"}
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            {statusCode === 404 ? "Page Not Found" : "An Error Occurred"}
          </h1>
          <p className="text-gray-400 max-w-md mb-8">
            {description}
          </p>
          <Link
            href="/"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500 transition-colors"
          >
            ← Back to Home
          </Link>
        </main>
      </body>
    </html>
  );
}

CustomError.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default CustomError;

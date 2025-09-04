import { useTranslation } from "react-i18next";
import { Link, useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ClientError() {
  const error = useRouteError();
  const { t } = useTranslation();
  let message = "An unexpected error occurred";
  if (isRouteErrorResponse(error)) {
    // thrown by React Router loaders/actions
    message = `${error.status} – ${error.statusText}`;
  } else if (error instanceof Error) {
    // any other JS Error
    message = error.message;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className=" flex flex-col items-center justify-center max-w-[90%]">
        <h1 className="text-2xl font-bold mb-2 text-red-600">
          Oops, {t("Something went wrong")}!
        </h1>
        <p className="mb-4 text-lg text-gray-700 text-center">{message}</p>
        <Link
          to="/admin/home"
          className="px-4 py-2 bg-primary text-white hover:bg-indigo-700 transition-all delay-200"
        >
          {t("Back to Dashboard")}
        </Link>
      </div>
    </div>
  );
}

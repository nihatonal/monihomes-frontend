import { useTranslation } from "react-i18next";

const ReservationForm = () => {
  const { t } = useTranslation(); // i18n kullanarak dil desteği sağlıyoruz

  return (
    <div className="mt-10">
      <form className="max-w-lg mx-auto bg-white p-8 shadow-lg rounded-md">
        <div className="mb-2">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            {t("reservation.form.firstName")}
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder={t("reservation.form.firstNamePlaceholder")}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-2">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            {t("reservation.form.lastName")}
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder={t("reservation.form.lastNamePlaceholder")}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-2">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            {t("reservation.form.phone")}
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder={t("reservation.form.phonePlaceholder")}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            {t("reservation.form.email")}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder={t("reservation.form.emailPlaceholder")}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-2">
          <label htmlFor="numberOfPeople" className="block text-sm font-medium text-gray-700">
            {t("reservation.form.numberOfPeople")}
          </label>
          <input
            type="number"
            id="numberOfPeople"
            name="numberOfPeople"
            placeholder={t("reservation.form.numberOfPeoplePlaceholder")}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-2 flex space-x-4">
          <div className="w-full">
            <label htmlFor="checkin" className="block text-sm font-medium text-gray-700">
              {t("reservation.form.checkIn")}
            </label>
            <input
              type="date"
              id="checkin"
              name="checkin"
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="w-full">
            <label htmlFor="checkout" className="block text-sm font-medium text-gray-700">
              {t("reservation.form.checkOut")}
            </label>
            <input
              type="date"
              id="checkout"
              name="checkout"
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        <button type="submit" className="w-full bg-yellow-500 text-white py-3 rounded-full mt-6">
          {t("reservation.form.submitButton")}
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;

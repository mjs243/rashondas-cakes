// app/success/page.tsx

export default function SuccessPage() {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <h1 className="text-3xl font-bold mb-4 text-green-600">
          Payment Successful!
        </h1>
        <p className="text-gray-700 mb-8">
          Thank you for your order! Your payment has been processed and we’ll get started on your delicious cakes right away!
        </p>
        <a
          href="/"
          className="bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 transition"
        >
          Return to Home
        </a>
      </div>
    );
  }
  
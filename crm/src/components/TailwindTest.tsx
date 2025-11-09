export default function TailwindTest() {
  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Tailwind Test</h1>
      <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg">
        This should be a red box with white text
      </div>
      <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg mt-4">
        This should be a green box with white text
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
        Test Button
      </button>
    </div>
  )
}
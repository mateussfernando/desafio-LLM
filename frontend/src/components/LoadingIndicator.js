export default function LoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-white/10 backdrop-blur-md text-gray-100 rounded-xl px-4 py-3 max-w-3xl">
        <div className="flex space-x-2">
          <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse delay-150"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse delay-300"></div>
        </div>
      </div>
    </div>
  );
}

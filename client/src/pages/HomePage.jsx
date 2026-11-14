import SendCard from '../components/SendCard';
import ReceiveCard from '../components/ReceiveCard';

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 flex flex-col items-center">
      {/* Hero */}
      <h1 className="sky-share-shimmer text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-[0.15em] sm:tracking-[0.25em] mb-8 sm:mb-10 md:mb-14 select-none text-center">
        SKY SHARE
      </h1>

      {/* Main Two-Card Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <SendCard />
        <ReceiveCard />
      </div>
    </div>
  );
}

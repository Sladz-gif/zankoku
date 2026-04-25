import { Heart } from 'lucide-react';

const SupportSidebar = () => {
  return (
    <div className="px-3 py-2.5 border-t border-[#1A1A2E] flex-shrink-0">
      <a
        href="/support"
        className="flex items-center gap-2 px-3 py-2 rounded-[6px] text-[#6666AA] no-underline font-rajdhani text-[13px] font-semibold tracking-wider transition-all duration-150 ease -webkit-tap-highlight-color-transparent cursor-pointer bg-none border-none w-full hover:text-[#8B00FF] hover:bg-[rgba(139,0,255,0.08)]"
      >
        <Heart size={15} color="#8B00FF" />
        <span>Support Zankoku</span>
      </a>
    </div>
  );
};

export default SupportSidebar;

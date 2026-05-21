import {
  Monitor,
  Smartphone,
  Tablet,
  Watch,
  Tv,
  Gamepad2,
  BookOpen,
  Bot,
  Server,
  CircleQuestionMark,
  SquareTerminal,
  HatGlasses,
  RectangleGoggles,
} from 'lucide-react';

export const getDeviceIcon = (
  deviceClass: string,
  className: string = 'size-4',
) => {
  const type = deviceClass?.toLowerCase() || 'unknown';
  switch (type) {
    case 'desktop':
      return <Monitor className={className} />;
    case 'phone':
    case 'mobile':
      return <Smartphone className={className} />;
    case 'tablet':
      return <Tablet className={className} />;
    case 'watch':
      return <Watch className={className} />;
    case 'tv':
    case 'set-top box':
      return <Tv className={className} />;
    case 'game console':
    case 'handheld game console':
      return <Gamepad2 className={className} />;
    case 'virtualreality':
      return <RectangleGoggles className={className} />;
    case 'ereader':
      return <BookOpen className={className} />;
    case 'home appliance':
      return <Server className={className} />;
    case 'robot':
    case 'robot mobile':
    case 'robot imitator':
      return <Bot className={className} />;
    case 'hacker':
      return <SquareTerminal className={`${className} text-danger`} />;
    case 'anonymized':
      return <HatGlasses className={className} />;
    case 'unclassified':
    case 'unknown':
    default:
      return <CircleQuestionMark className={className} />;
  }
};

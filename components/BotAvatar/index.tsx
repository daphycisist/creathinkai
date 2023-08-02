import { useUser } from '@clerk/nextjs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const BotAvatar = () => {
  const { user } = useUser();
  return (
    <Avatar className="w-8 h-8">
      <AvatarImage className='p-1' src="/logo.png" />
    </Avatar>
  );
};

export default BotAvatar;

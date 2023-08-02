import { UserButton } from '@clerk/nextjs';
import { Menu } from 'lucide-react';
import { Button } from '../ui/button';
import MobileSidebar from '../MobileSidebar';

const Navbar = () => {
  return (
    <div className="flex items-center p-4">
     <MobileSidebar />
      <div className="flex justify-end w-full">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;

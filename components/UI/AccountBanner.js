import Image from 'next/image';

const AccountBanner = ({ children, src }) => {

  return (
    <div className="flex flex-row justify-around items-center w-60">
      <Image
        className="rounded-full"
        src={src}
        width={75}
        height={75}
      />
      <p className="text-xl">{children}</p>
    </div>
  );
};

export default AccountBanner;

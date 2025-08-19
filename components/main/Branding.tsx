import Image from "next/image";

export default function Branding() {
  return (
    <div className="branding">
      <Image
        src="/images/banner/icon.png"
        alt="Logo"
        height={50}
        width={150}
        className="logo"
      />
      <h1 className="title">eMasjid</h1>
    </div>
  );
}

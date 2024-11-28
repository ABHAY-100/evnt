import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  Link,
} from "@nextui-org/react";
import logo from "@/assets/evnt..svg";
import Image from "next/image";

const NavBar = () => {
  return (
    <NextUINavbar
      maxWidth={"full"}
      className="fixed z-10 flex backdrop-blur-3xl items-center justify-between lg:h-24 top-bar px-5 bg-near-black max-md:px-1 max-md:h-[80px] top-0 md:h-[96px] border-b-2 border-white/40 border-dashed max-h-[90px]"
      style={{ maxWidth: "none" }}
      data-aos-delay="2000"
      data-aos-anchor-placement="top-bottom"
      data-aos="fade-down"
      data-aos-duration="500"
    >
      <NavbarContent className="relative h-full w-full">
        <NavbarBrand className="h-full w-fit">
          <Link
            href="/"
            className="flex flex-row items-center justify-center h-full gap-4"
          >
            <Image
              src={logo}
              alt="swift_summarizer_logo"
              className="w-[70px] h-full max-md:w-[63px]"
            />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        justify="end"
        className="relative h-full w-fit flex justify-end p-0 m-0 gap-0 items-center"
      >
        <Link
          href="https://github.com/ABHAY-100/evnt"
          target="_blank"
          className="flex flex-row border-2 border-white/40 hover:border-white/80 ease-linear  border-dashed items-center justify-center h-full gap-4"
        >
          <div className="h-full border-2w-fit justify-center items-center flex text-[21px] font-bold text-white text-center leading-[23.8px] pr-[19px] pl-[21px] max-md:text-[18px] max-md:leading-[21px] max-sm:leading-[19px] max-sm:text-[16px]">
            Star on <br />
            GitHub ⭐
          </div>
        </Link>
      </NavbarContent>
    </NextUINavbar>
  );
};

export default NavBar;

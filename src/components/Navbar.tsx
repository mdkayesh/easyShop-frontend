"use client";

import { authenticated, deleteCookies } from "@/app/actions";
import Logo from "@/assets/Logo";
import { setAuthenticated } from "@/lib/features/auth/authSlice";
import { useAppSelector } from "@/lib/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiMenuAlt2 } from "react-icons/hi";
import { IoChevronDownOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import MobileMenu from "./MobileMenu";
import Modal from "./Modal";
import { ProfileMenu } from "./ProfileMenu";
import SearchBar from "./SearchBar";
import { ToggleTheme } from "./ToggleTheme";
import { LoginForm } from "./forms/LoginForm";
import SignupForm from "./forms/SignupForm";
import { Button } from "./ui/button";

const links = [
  {
    title: "Shops",
    url: "/shops",
  },
  {
    title: "Contact",
    url: "/contact",
  },

  {
    title: "Offers",
    url: "/offers",
  },
  {
    title: "Pages",
    url: "",
    subLinks: [
      {
        title: "Profile",
        url: "/profile",
      },
      {
        title: "Contact Us",
        url: "/contact",
      },
      {
        title: "Checkout",
        url: "/checkout",
      },
      {
        title: "Orders",
        url: "/profile/orders",
      },
    ],
  },
];

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [isRegisterTab, setIsRegisterTab] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // from redux
  const { isAuthenticated } = useAppSelector((state) => state.authSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    const authentication = async () => {
      try {
        const res = await authenticated();
        dispatch(setAuthenticated(res));
      } catch (error) {
        console.log(error);
      }
    };

    authentication();
    return () => {};
  }, [dispatch, isAuthenticated]);

  const handleLogout = async () => {
    try {
      await deleteCookies("token");
      setIsConfirm(false);
      dispatch(setAuthenticated(false));
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="navbar px-default py-3 bg-secondary shadow-lg border-b sticky top-0 left-0 z-50">
        <nav className="flex gap-6 items-center justify-between">
          <div className="left flex gap-6 items-center flex-1">
            <Logo />

            <div className="search flex-1 max-w-sm hidden md:block">
              <SearchBar />
            </div>
          </div>

          <div className="right flex gap-6 items-center">
            <div className="flex gap-5 items-center">
              <div className="links hidden lg:block">
                <ul className="flex gap-6 items-center">
                  {links.map((link) => (
                    <li className="group relative" key={link.url}>
                      <Link
                        href={link.url}
                        className="flex gap-1 items-center group-hover:text-primary transition-colors duration-300"
                      >
                        <span>{link.title}</span>
                        {link.subLinks && (
                          <span>
                            <IoChevronDownOutline />
                          </span>
                        )}
                      </Link>
                      {link.subLinks && (
                        <ul className="invisible scale-95 translate-y-2 opacity-0 absolute top-[130%] right-0 w-[160px] border bg-card rounded-lg transition-all duration-150 shadow-lg p-0.5 group-hover:visible group-hover:scale-100 group-hover:translate-y-0 group-hover:opacity-100">
                          {link.subLinks.map((link) => (
                            <li key={link.url}>
                              <Link
                                className="block px-3 py-2 hover:bg-accent rounded-lg"
                                href={link.url}
                              >
                                {link.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* mobile menu */}
            <button
              type="button"
              className="menu text-3xl hidden md:block lg:hidden"
              title="menu"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              <HiMenuAlt2 />
            </button>

            {isAuthenticated && (
              <div className="profile">
                <ProfileMenu setIsOpen={setIsConfirm} />
              </div>
            )}
            <div className="hidden lg:block">
              <ToggleTheme />
            </div>
            {!isAuthenticated && (
              <Button onClick={() => setIsOpen(!isOpen)}>Join</Button>
            )}
          </div>
        </nav>
      </div>

      <Modal isOpen={isOpen} setIsOpen={setIsOpen} className="max-w-md">
        <div className="px-4 py-7 md:px-6">
          {isRegisterTab ? (
            <div className="signup">
              <div className="flex text-center flex-col items-center">
                <Logo />
                <p className="my-3">
                  By signing up, you agree to our{" "}
                  <Link href={"/"} className="text-primary hover:underline">
                    terms & policy
                  </Link>
                </p>
              </div>

              <SignupForm setIsOpen={setIsOpen} />

              <div className="flex-1 h-0.5 bg-muted my-6"></div>
              <p className="text-center">
                Already have any account?{" "}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => setIsRegisterTab(false)}
                >
                  Login
                </button>
              </p>
            </div>
          ) : (
            <div className="login">
              <div className="flex text-center flex-col items-center">
                <Logo />
                <p className="my-3">Login with your email & password</p>
              </div>
              <LoginForm setIsOpen={setIsOpen} />
              <div className="flex-1 h-0.5 bg-muted my-6"></div>

              <p className="text-center">
                Don&apos;t have any account?{" "}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => setIsRegisterTab(true)}
                >
                  Register
                </button>
              </p>
            </div>
          )}
        </div>
      </Modal>

      <MobileMenu isOpen={isMobileOpen} setIsOpen={setIsMobileOpen} />

      {/* logout confirmation */}
      <Modal
        isOpen={isConfirm}
        setIsOpen={setIsConfirm}
        className="w-fit h-fit"
      >
        <div className="p-5 rounded-lg flex flex-col justify-center items-center text-center gap-3">
          <h2 className="text-lg">Are you sure to logout?</h2>
          <div className="flex justify-between items-center gap-4">
            <Button type="button" onClick={() => setIsConfirm(false)}>
              <span>No</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="border-primary hover:bg-primary hover:text-white"
              onClick={handleLogout}
            >
              <span>Ok</span>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Navbar;
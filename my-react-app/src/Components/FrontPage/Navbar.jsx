import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../Api";

const Navbar = ({ isLoggedIn, username, setUsername }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleSwitchToSignIn = () => {
    navigate("/signInPage");
  };

  const handleSwitchToSignUp = () => {
    navigate("/signUp");
  };

  const handleLogout = async () => {
    setUsername(null);
    try {
      const response = await logoutUser();
      console.log("Logout response:", response);
    } catch (err) {
      console.error("Error logging out:", err);
    }
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="navbar font- sans ">
      <nav
        className={`fixed w-full z-50 top-0 left-0 transition-all duration-300 ease-in-out ${
          isScrolled
            ? "bg-black/60 backdrop-blur-md  border-blue-500/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-screen-l flex flex-wrap items-center justify-between mx-auto p-2 md:p-2">
          <a
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="Logo"
            />
            <span className="self-center text-2xl font-bold whitespace-nowrap text-white text-shadow-neon">
              Brand
            </span>
          </a>

          <div className="flex items-center space-x-4 md:order-2">
            {isLoggedIn() ? (
              <>
                {" "}
                <span className="text-white font-semibold flex items-center space-x-2">
                  <span>{username}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-white border border-red-400 hover:bg-red-500 hover:text-white font-semibold py-1.5 px-4 rounded-lg transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSwitchToSignUp}
                  className="hidden md:inline-block text-white border border-blue-400 hover:bg-blue-500 hover:text-white font-semibold py-1.5 px-4 rounded-lg transition duration-300"
                >
                  SignUp
                </button>
                <button
                  onClick={handleSwitchToSignIn}
                  className="hidden md:inline-block text-white border border-blue-400 hover:bg-blue-500 hover:text-white font-semibold py-1.5 px-4 rounded-lg transition duration-300"
                >
                  SignIn
                </button>
              </>
            )}

            <button
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:text-blue-400 hover:shadow-neon-blue focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-controls="navbar-sticky"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>

          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } items-center justify-end w-full md:flex md:w-auto md:order-1 xl:block xl:flex-row xl:space-x-8 rtl:space-x-reverse`}
            id="navbar-sticky"
          >
            <ul
              className={`flex flex-col p-2 md:p-0 mt-3 font-bold rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 ${
                isMenuOpen
                  ? "bg-black/70 backdrop-blur-md border border-blue-500/30"
                  : "bg-transparent"
              } xl:text-xl`}
            >
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-white rounded relative overflow-hidden group transition-all duration-300"
                  aria-current="page"
                >
                  <span className="relative z-10 group-hover:text-blue-300 transition-colors duration-300">
                    Home
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300 group-hover:shadow-neon-blue"></span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-white rounded relative overflow-hidden group transition-all duration-300"
                >
                  <span className="relative z-10 group-hover:text-blue-300 transition-colors duration-300">
                    About
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300 group-hover:shadow-neon-blue"></span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-white rounded relative overflow-hidden group transition-all duration-300"
                >
                  <span className="relative z-10 group-hover:text-blue-300 transition-colors duration-300">
                    Services
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300 group-hover:shadow-neon-blue"></span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-white rounded relative overflow-hidden group transition-all duration-300"
                >
                  <span className="relative z-10 group-hover:text-blue-300 transition-colors duration-300">
                    Contact
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300 group-hover:shadow-neon-blue"></span>
                </a>
              </li>
              {isLoggedIn() ? (
                <>
                  <li className="md:hidden mt-2 flex items-center space-x-2 text-white font-semibold">
                    <span>{username}</span>
                  </li>
                  <li className="md:hidden mt-2">
                    <span
                      onClick={handleLogout}
                      className="block text-white border border-red-400 hover:bg-red-500 hover:text-white font-semibold py-1.5 px-4 rounded-lg transition duration-300"
                    >
                      Logout
                    </span>
                  </li>
                </>
              ) : (
                <>
                  <li className="md:hidden mt-2">
                    <span
                      onClick={handleSwitchToSignUp}
                      className="block text-white border border-blue-400 hover:bg-blue-500 hover:text-white font-semibold py-1.5 px-4 rounded-lg transition duration-300"
                    >
                      SignUp
                    </span>
                  </li>
                  <li className="md:hidden mt-2">
                    <span
                      onClick={handleSwitchToSignIn}
                      className="block text-white border border-blue-400 hover:bg-blue-500 hover:text-white font-semibold py-1.5 px-4 rounded-lg transition duration-300"
                    >
                      SignIn
                    </span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </section>
  );
};

export default Navbar;

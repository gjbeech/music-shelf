import Link from "next/link";
import Image from "next/link";
import styles from "../styles/Header.module.css";

export function Nav() {
  var Nav = require("./Nav");

  return (
    // <h2>
    //   <Link href="/">Back to Home</Link>
    //   {/* <Image alt="Logo" src=""></Image> */}
    // </h2>

    <nav className={styles.nav}>
      <ul className={styles.list}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/createList">New list</Link>
        </li>
        <li>
          <Link href="/scan">Scan folders</Link>
        </li>
        <li>
          <Link href="/devices">Manage Devices</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;

// const MyImage = (props) => {
//     return (
//       <Image
//         loader={myLoader}
//         src="me.png"
//         alt="Picture of the author"
//         width={500}
//         height={500}
//       />
//     )
//   }

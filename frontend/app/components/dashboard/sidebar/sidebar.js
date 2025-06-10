import styles from '../sidebar/sidebar.module.css'
import {
    MdDashboard,
    MdShoppingBag,
    MdTag,
    MdOutlineTypeSpecimen,
    MdCategory,
    MdLogout
} from "react-icons/md";
import MenuLink from './menuLink/menuLink';
import Image from 'next/image';
const menuItems = [
    {
        title: "Pages",
        list: [
            {
                title: "Dashboard",
                path: "/dashboard",
                icon: <MdDashboard />
            },
            {
                title: "Items",
                path: "/items",
                icon: <MdShoppingBag />
            },
            {
                title: "Keywords",
                path: "/keywords",
                icon: <MdTag />
            },
            {
                title: "Categories",
                path: "/categories",
                icon: <MdCategory />
            },
            {
                title: "Types",
                path: "/types",
                icon: <MdOutlineTypeSpecimen />
            },
        ]

    }
];
const Sidebar = () => {
    return (
        <div className={styles.container}>
            <div className={styles.user}>
                <Image className={styles.userImage} src="logo.svg" alt="" width="50" height="50" />
                <div className={styles.userDetail}>
                    <span className={styles.username}>James Jackson</span>
                    <span className={styles.role}>Admin</span>
                </div>
            </div>
            <ul className={styles.list}>
                {
                    menuItems.map((menu) => (
                        <li key={menu.title}>
                            <span className={styles.menu_head}>{menu.title}</span>
                            {
                                menu.list.map((subMenu) => (
                                    <MenuLink item={subMenu} key={subMenu.title} />
                                ))
                            }
                        </li>
                    ))
                }
            </ul>
            <button className={styles.logout}>
                <MdLogout />
                Logout
            </button>
        </div>
    )
}

export default Sidebar
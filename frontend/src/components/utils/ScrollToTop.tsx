import {useLayoutEffect} from "react";
import {useLocation} from "react-router-dom";

export default function ScrollToTop() {
    const {pathname, search, hash} = useLocation();

    useLayoutEffect(() => {
        if (hash) {
            const el = document.querySelector(hash);
            if (el) el.scrollIntoView({block: "start", behavior: "auto"});
            else window.scrollTo({top: 0, left: 0, behavior: "auto"});
        } else {
            window.scrollTo({top: 0, left: 0, behavior: "auto"});
        }
    }, [pathname, search, hash]);

    return null;
}
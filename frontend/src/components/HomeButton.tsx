import {ArrowLeft} from "lucide-react";
import {Link} from "react-router-dom";
import {Button} from "./ui/button";

const HomeButton = () => {
    return (
        <Link to="/">
            <Button
                variant="ghost"
                size="sm"
                className="fixed top-24 left-12 z-10 rounded-full bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            >
                <ArrowLeft className="mr-2 h-4 w-4"/>
                На главную
            </Button>
        </Link>
    );
};

export default HomeButton;
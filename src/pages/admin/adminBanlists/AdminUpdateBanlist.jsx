import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBanlistById } from "../../../services/banlist";

const AdminUpdateBanlist = () => {
    const [banlist, setBanlist] = useState({});
    const { banlistId } = useParams();

    useEffect(() => {
        getBanlistById(Number(banlistId), setBanlist);
    }, [banlistId]);

    console.log(banlist);

    return (
        <div>
            <h1>Admin Update Banlist</h1>
        </div>
    );
}


export default AdminUpdateBanlist;
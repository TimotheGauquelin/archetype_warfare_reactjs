const AdminUpdateBanlist = () => {
    const [banlist, setBanlist] = useState({});
    const { banlistId } = useParams();

    useEffect(() => {
        getBanlistById(banlistId, setBanlist);
    }, [banlistId]);

    console.log(banlist);

    return (
        <div>
            <h1>Admin Update Banlist</h1>
        </div>
    );
}


export default AdminUpdateBanlist;
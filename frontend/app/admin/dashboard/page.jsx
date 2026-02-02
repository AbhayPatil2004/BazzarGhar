import AdminStats from "../components/AdminStats"
import AdminHeader from "../components/AdminHeader"
import StoreRequests from '../components/StoreOpeningRequest.jsx'
import AdminUsers from "../components/AdminUser.jsx"


export default function Page(){
    return (
        <div>
            <AdminHeader></AdminHeader>
            <AdminStats></AdminStats>
            <StoreRequests></StoreRequests>
            <AdminUsers></AdminUsers>
        </div>
    )
}
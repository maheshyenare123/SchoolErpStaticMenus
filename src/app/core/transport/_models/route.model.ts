export class RouteModel {

    fare: number;
    id: number;
    isActive: string;
    noOfVehicle: number;
    note: string;
    routeTitle: string; 

    clear() {
        this.fare= 0;
        this.id= 0;
        this.isActive= '';
        this.noOfVehicle= 0;
        this.note= '';
        this.routeTitle= '';
    }
}
export class VehicleRouteDtoModel {

    id: number;
    isActive: string;
    routeId: number;
    vehicleId: number;

    clear() {
        this.id= 0;
        this.isActive= '';
        this.routeId= 0;
        this.vehicleId= 0;
    }
}
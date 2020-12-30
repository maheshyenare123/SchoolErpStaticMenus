import { VehicleModel } from './vehicle.model';


export class AssignVehicleModel {

    id: number;
    isActive: string;
    routeId: number;
    routeTitle:string;
    vehicles: VehicleModel[];
    // vehicleId: number;

    clear() {
        this.id= 0;
        this.isActive= '';
        this.routeId= 0;
        this.routeTitle= '';
        // this.vehicleId= 0;
        this.vehicles = []
    }
}
import AgregarEvento from './AgregarEvento';
import Logout from './Logout';
import ProximoBiberon from './ProximoBiberon';
import ListadoEventos from './ListadoEventos';
import InformeBiberones from './InformeBiberones';
import InformePañales from './InformePañales';
import GraficoPorCategoria from './GraficoPorCategoria';
import GraficoComidasUltimaSemana from './GraficoComidasUltimaSemana';

const Dashboard = () => {
    return (
        <div style={{ position: 'relative' }}>
            <Logout />
            <div className="container my-4">
                <h1 className="mb-4 text-center">Dashboard</h1>
                <div className="row mb-4 d-flex justify-content-center">
                </div>
                <div className="row mb-4">
                    <InformeBiberones />
                    <ProximoBiberon />
                    <InformePañales />
                </div>
                <div className="row mb-4 justify-content-between">
                    <AgregarEvento />
                    <div className='col-6 d-flex flex-column'>
                        <div className="mb-4">
                            <GraficoPorCategoria />
                        </div>
                        <div className="mt-auto">
                            <GraficoComidasUltimaSemana />
                        </div>
                    </div>
                </div>
                <div className="row mb-4">
                    <ListadoEventos />
                </div>
            </div>
        </div >
    );
};

export default Dashboard;

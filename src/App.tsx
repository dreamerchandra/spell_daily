import Rive from '@rive-app/react-canvas';

export const App = () => (
  <div className="h-screen w-screen">
    <Rive
      src="https://cdn.rive.app/animations/vehicles.riv"
      stateMachines="bumpy"
    />
  </div>
);

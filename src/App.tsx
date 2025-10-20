import Rive from '@rive-app/react-canvas';

export const App = () => (
  <div>
    <Rive
      src="https://cdn.rive.app/animations/vehicles.riv"
      stateMachines="bumpy"
    />
  </div>
);

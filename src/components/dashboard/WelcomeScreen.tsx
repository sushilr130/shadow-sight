
import DataUploader from '../ui/DataUploader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const WelcomeScreen = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Card className="max-w-3xl w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to the ShadowSight Insight  Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground mb-8">
            To get started, please upload your breach data CSV file below.
          </p>
          <DataUploader />
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeScreen;

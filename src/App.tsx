import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import BusinessAdvisor from './components/BusinessAdvisor';

function App() {
  return (
    <Theme accentColor="blue" grayColor="slate" radius="medium" scaling="95%">
      <main className="min-h-screen bg-background text-foreground">
        <BusinessAdvisor />
      </main>
    </Theme>
  );
}

export default App;

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Main from './pages/Main';
import Search from './pages/Search';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css';

function App() {
  return (
    <div style={{ backgroundColor: '#282c34' }}>
      <BrowserRouter>
        <Route
          render={({ location }) => (
            <TransitionGroup>
              <CSSTransition key={location.pathname} timeout={1000} classNames="fade">
                <Switch location={location}>
                  <Route exact path="/" component={Main} />
                  <Route path="/search" component={Search} />
                </Switch>
              </CSSTransition>
            </TransitionGroup>
          )}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;

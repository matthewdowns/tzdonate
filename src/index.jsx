const {
    BeaconEvent,
    defaultEventCallbacks,
    NetworkType
} = require('@airgap/beacon-sdk');
const { BeaconWallet } = require('@taquito/beacon-wallet');
const React = require('react');
const {
    Button,
    Col,
    Container,
    Form,
    InputGroup,
    Row
} = require('react-bootstrap');
const ReactDOM = require('react-dom');
const tezosToolkit = require('./services/tezosToolkit');
require('./index.css');

function App() {
    const [initializing, setInitializing] = React.useState(true);
    const [connecting, setConnecting] = React.useState(false);
    const [accountInfo, setAccountInfo] = React.useState(undefined);

    const [beaconWallet, setBeaconWallet] = React.useState();

    async function getActiveAccount() {
        if (beaconWallet && accountInfo === undefined) {
            setAccountInfo(null);
            const _accountInfo = await beaconWallet.client.getActiveAccount();
            setAccountInfo(_accountInfo);
        }
    }

    React.useEffect(() => {
        if (initializing) {
            setInitializing(false);
            setBeaconWallet(new BeaconWallet({
                name: 'tzdonate',
                appUrl: 'https://donate.tez',
                iconUrl: 'https://donate.tez/favicon.ico',
                preferredNetwork: NetworkType.EDONET,
                eventHandlers: {
                    [BeaconEvent.PAIR_INIT]: {
                        handler: async (data) => {
                            const oldHandler = data.abortedHandler;
                            const newHandler = () => {
                                if (oldHandler) oldHandler();
                                setConnecting(false);
                            }
                            data.abortedHandler = newHandler // Replace the internal abortedHandler with the new one
                            await defaultEventCallbacks.PAIR_INIT(data) // Add this if you want to keep the default behaviour.
                        }
                    },
                    [BeaconEvent.PERMISSION_REQUEST_ERROR]: {
                        handler: async (data) => {
                            await defaultEventCallbacks.PERMISSION_REQUEST_ERROR(data);
                            setConnecting(false);
                        }
                    }
                }
            }));
        }
    }, [initializing]);
    React.useEffect(() => getActiveAccount(), [beaconWallet]);

    return (
        <React.Fragment>
            <header className="bg-light p-2">
                <Button
                    className="pill float-right"
                    disabled={connecting}
                    variant="outline-primary"
                    onClick={async () => {
                        if (beaconWallet) {
                            if (accountInfo) {
                                await beaconWallet.clearActiveAccount();
                                setAccountInfo(undefined);
                            } else {
                                setConnecting(true);
                                await beaconWallet.requestPermissions({
                                    network: { type: NetworkType.EDONET }
                                });
                                await getActiveAccount();
                                setConnecting(false);
                            }
                        }
                    }}
                >
                    {accountInfo ? (
                        <span>
                            {accountInfo.address}
                        </span>
                    ) : (
                        <React.Fragment>
                            {connecting && (
                                <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    style={{
                                        position: 'relative',
                                        bottom: '2px',
                                        left: '1px',
                                        marginRight: '8px'
                                    }}
                                />
                            )}
                            <span>
                                {connecting ? 'Connecting...' : 'Connect Wallet'}
                            </span>
                        </React.Fragment>
                    )}
                </Button>
            </header>
            <main role="main">
                {accountInfo instanceof Error ? (
                    <p className="text-danger">
                        {accountInfo.message}
                    </p>
                ) : (accountInfo !== undefined && accountInfo !== null) ? (
                    <Button>
                        Deploy your Donation Button
                    </Button>
                ) : undefined}
            </main>
            <footer className="bg-dark p-2">
                Hi
            </footer>
        </React.Fragment>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
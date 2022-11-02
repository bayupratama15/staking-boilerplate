import "./App.css";
import react, { useEffect, useState } from "react";
import { ethers } from "ethers";
import artifact from "./artifacts/contracts/Staking.sol/Staking.json";
import "bootstrap/dist/css/bootstrap.min.css";

import NavBar from "./components/NavBar";
import StakeModal from "./components/StakeModal";
import { Bank, PiggyBank, Coin } from "react-bootstrap-icons";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";

const CONTRACT_ADDRESS = "0x3463AFB647F6d5313B65B83be2f8944A60f893a8";

function App() {
  // general
  const [provider, setProvider] = useState(undefined);
  const [signer, setSigner] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [signerAddress, setSignerAddress] = useState(undefined);

  // assets
  const [assetIds, setAssetIds] = useState([]);
  const [assets, setAssets] = useState([]);

  // staking
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [stakingLength, setStakingLength] = useState(undefined);
  const [stakingPercent, setStakingPercent] = useState(undefined);
  const [amount, setAmount] = useState(0);

  // helpers
  const toWei = (ether) => ethers.utils.parseEther(ether);
  const toEther = (wei) => ethers.utils.formatEther(wei);

  useEffect(() => {
    const onLoad = async () => {
      const provider = await new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      const contract = await new ethers.Contract(
        CONTRACT_ADDRESS,
        artifact.abi
      );
      setContract(contract);
    };
    onLoad();
  }, []);

  const isConnected = () => signer !== undefined;

  const getSigner = async () => {
    provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    return signer;
  };

  const getAssetIds = async (address, signer) => {
    const assetIds = await contract
      .connect(signer)
      .getPositionIdsForAddress(address);
    return assetIds;
  };

  const calcDaysRemaining = (unlockDate) => {
    const timeNow = Date.now() / 1000;
    const secondsRemaining = unlockDate - timeNow;
    return Math.max((secondsRemaining / 60 / 60 / 24).toFixed(0), 0);
  };

  const getAssets = async (ids, signer) => {
    const queriedAssets = await Promise.all(
      ids.map((id) => contract.connect(signer).getPositionById(id))
    );

    queriedAssets.map(async (asset) => {
      const parsedAsset = {
        positionId: asset.positionId,
        percentInterest: Number(asset.percentInterest) / 100,
        daysRemaining: calcDaysRemaining(Number(asset.unlockDate)),
        etherInterest: toEther(asset.weiInterest),
        etherStaked: toEther(asset.weiStaked),
        open: asset.open,
      };

      setAssets((prev) => [...prev, parsedAsset]);
    });
  };

  const connectAndLoad = async () => {
    const signer = await getSigner(provider);
    setSigner(signer);

    const signerAddress = await signer.getAddress();
    setSignerAddress(signerAddress);

    const assetIds = await getAssetIds(signerAddress, signer);
    setAssetIds(assetIds);

    getAssets(assetIds, signer);
  };

  const openStakingModal = (stakingLength, stakingPercent) => {
    setShowStakeModal(true);
    setStakingLength(stakingLength);
    setStakingPercent(stakingPercent);
  };

  const stakeEther = () => {
    const wei = toWei(amount);
    const data = { value: wei };
    contract.connect(signer).stakeEther(stakingLength, data);
    console.log("signer", signer);
  };

  const withdraw = (positionId) => {
    const a = contract.connect(signer).closePosition(positionId);
    console.log("a", a);
  };
  const cardStyle = {
    position: "absolute",
    top: "32px",
    right: 0,
    bottom: 0,
    left: 0,
    /* background: #FFF; */
    margin: "80px",
    height: "calc(100vh - 160px)",
  };
  return (
    <div className="App">
      <div>
        <NavBar isConnected={isConnected} connect={connectAndLoad} />
      </div>
      <Container fluid="md" className="mt-5 ">
        <Card
          className="vh-100"
          style={{ borderRadius: "45px", backgroundColor: "#043070" }}
        ></Card>
        <div className="cardStyle">
          {/* STAKING INFORMATION CARD*/}
          <Row className="justify-content-md-center mb-3">
            <Col md="12">
              <Card
                style={{
                  borderRadius: "20px",
                  padding: "10px",
                  boxShadow: "0px 10px 5px #263f4b",
                }}
              >
                <Card.Body>
                  <Card.Title>Staking Information Reward 1 Year</Card.Title>

                  <Table hover responsive>
                    <thead>
                      <tr>
                        <th>Periode</th>
                        <th>APY %</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>7 Days</td>
                        <td>7%</td>
                      </tr>
                      <tr>
                        <td>14 Days</td>
                        <td>10%</td>
                      </tr>
                      <tr>
                        <td>30 Days</td>
                        <td>12%</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xs lg="6" md="6" sm="12">
              <Card
                style={{
                  borderRadius: "20px",
                  padding: "10px",
                  boxShadow: "0px 10px 5px #263f4b",
                }}
              >
                <Card.Title>
                  <h5>Stake Periode </h5>
                </Card.Title>
                <Card.Body>
                  <Row>
                    <Col md="4">
                      <Card
                        onClick={() => openStakingModal(7, "7%")}
                        className="card-hover"
                      >
                        <Card.Body>
                          <span style={{ fontSize: "38px" }}>
                            <Coin />
                          </span>
                          <Card.Title>7 Days</Card.Title>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md="4">
                      <Card
                        onClick={() => openStakingModal(14, "10%")}
                        className="card-hover"
                      >
                        <Card.Body>
                          <span style={{ fontSize: "38px" }}>
                            <Coin />
                          </span>
                          <Card.Title>14 Days</Card.Title>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md="4">
                      <Card
                        onClick={() => openStakingModal(30, "12%")}
                        className="card-hover"
                      >
                        <Card.Body>
                          <span style={{ fontSize: "38px" }}>
                            <Coin />
                          </span>
                          <Card.Title>30 Days</Card.Title>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col xs lg="6" md="6" sm="12" className="stakedAssets">
              {/* LIST POSITION CARD*/}
              <Card
                style={{
                  borderRadius: "20px",
                  padding: "10px",
                  boxShadow: "0px 10px 5px #263f4b",
                }}
              >
                <Card.Title>
                  <h5> Staked Assets</h5>
                </Card.Title>
                <Card.Body>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>APY</th>
                        <th>Days Remaining</th>
                        <th>Interest</th>
                        <th>Staked</th>
                        <th>Withdraw</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assets.map((asset) => (
                        <tr>
                          <td>{asset.percentInterest}%</td>
                          <td>{asset.daysRemaining}</td>
                          <td>{asset.etherInterest} CRYO</td>
                          <td>{asset.etherStaked} CRYO</td>
                          <td>
                            {asset.open ? (
                              <Button
                                variant="outline-primary"
                                onClick={() => withdraw(asset.positionId)}
                              >
                                Withdraw
                              </Button>
                            ) : (
                              <Badge pill bg="danger">
                                Closed
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
      {showStakeModal && (
        <StakeModal
          onClose={() => setShowStakeModal(false)}
          stakingLength={stakingLength}
          stakingPercent={stakingPercent}
          amount={amount}
          setAmount={setAmount}
          stakeEther={stakeEther}
        />
      )}
    </div>
  );
}

export default App;

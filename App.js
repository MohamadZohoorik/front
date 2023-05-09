/* eslint-disable */


import React, { createRef, useState } from 'react'
import {
  Container,
  Dimmer,
  Loader,
  Grid,
  Sticky,
  Message,
} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import styles from "./styles.module.css"

import { SubstrateContextProvider, useSubstrateState } from './substrate-lib'
import { DeveloperConsole } from './substrate-lib/components'

import AccountSelector from './AccountSelector'
import Balances from './Balances'
import BlockNumber from './BlockNumber'
import Events from './Events'
import Interactor from './Interactor'
import Metadata from './Metadata'
import NodeInfo from './NodeInfo'
import TemplateModule from './TemplateModule'
import Transfer from './Transfer'
import Upgrade from './Upgrade'

function Main() {
  const { apiState, apiError, keyringState } = useSubstrateState()

  const loader = text => (
    <Dimmer active>
      <Loader size="small">{text}</Loader>
    </Dimmer>
  )

  const message = errObj => (
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message
          negative
          compact
          floating
          header="Error Connecting to Substrate"
          content={`Connection to websocket '${errObj.target.url}' failed.`}
        />
      </Grid.Column>
    </Grid>
  )

  if (apiState === 'ERROR') return message(apiError)
  else if (apiState !== 'READY') return loader('Connecting to Substrate')

  if (keyringState !== 'READY') {
    return loader(
      "Loading accounts (please review any extension's authorization)"
    )
  }

  const contextRef = createRef()

  const [tab, setTab] = useState(1)

  return (
    <>
    <div className={styles.buttons_container}> 
      <button onClick={() => setTab(1)} style={{background: tab === 1 && "#999999" }}>Node and block info</button>
      <button onClick={() => setTab(2)} style={{background: tab === 2 && "#999999" }}>Balances</button>
      <button onClick={() => setTab(3)} style={{background: tab === 3 && "#999999" }}>Transfer</button>
      <button onClick={() => setTab(4)} style={{background: tab === 4 && "#999999" }}>Events</button>
    </div>

    {/* <button onClick={connectWalletHandler}>Subwallet</button> */}

    <div ref={contextRef}>
      <Sticky context={contextRef}>
        <AccountSelector />
      </Sticky>
      
      <Container>
        <Grid stackable columns="equal">
          {tab === 1 && <Grid.Row stretched>
            <NodeInfo />
            <Metadata />
            <BlockNumber />
            <BlockNumber finalized />
          </Grid.Row>}

          {tab === 2 && <Grid.Row stretched>
            <Balances />
          </Grid.Row>}

          {tab === 3 && <Grid.Row>
            <Transfer />
            <Upgrade />
          </Grid.Row>}

          {tab === 4 && <Grid.Row>
            <Interactor />
            <Events />
          </Grid.Row>}

          <Grid.Row>
            <TemplateModule />
          </Grid.Row>
        </Grid>
      </Container>
      <DeveloperConsole />
    </div>
    </>
  )
}

export default function App() {
  return (
    <SubstrateContextProvider >
      <Main />
    </SubstrateContextProvider>
  )
}

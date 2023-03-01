import '@/styles/KitSearch.module.css'


import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useEffect, useState, createRef } from 'react';
import Autocomplete from '@mui/material/Autocomplete';

// TODO: Evaluate if this adds any benefit on top of browsers native gzip
// Evaluating optimization options
// import { zlibSync, unzlibSync } from 'fflate';
// import {Trie} from 'tiny-trie';
// import {PackedTrie} from 'tiny-trie/lib/PackedTrie';

// TODO: Input validation
const isValidLabelId = (labelId) => {
  const pattern = /\d{2}-\d{3}-\d{4}/g;
  return labelId.match(pattern);
}

const fetcher = async (url) => {
  const res = await fetch(url);

  return res.json();
}

export default function KitSearch({ suggestions }) {
  const [labelId, setLabelId] = useState('');
  const [matchingKits, setMatchingKits] = useState([]);
  const labelIDInput = createRef();

  useEffect(() => {
    async function fetchKits() {
      //TODO: Move this to .env file based on where server is running\
      // TODO: Handle error case
      const kitsData = await fetcher(`http://localhost:3000/api/kits?filter=${labelId}&limit=10`);
      setMatchingKits(kitsData);
    }

    fetchKits();
  }, [labelId]);

  const onTextFieldChange = (e) => {
    setLabelId(e.target.value);
  };
  const onAutoCompleteChange = (_, value) => {
    setLabelId(value);
  };


  const matchingKit = matchingKits.find(kit => kit.label_id === labelId);
  return <Container component="main" maxWidth="xs">
    <CssBaseline />
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box component="form" noValidate sx={{ mt: 1 }}>
        <Autocomplete
          onChange={onAutoCompleteChange}
          disablePortal
          id="label-id-selector"
          options={matchingKits.map(({ label_id }) => label_id)}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField onChange={onTextFieldChange} {...params} label="Label ID" />}
        />
        <Typography component="subtitle" variant="body2">Fill in a label ID to retrieve tracking information</Typography>
        <TextField disabled={!matchingKit} InputProps={{
          readOnly: true,
        }} label="Fedex Tracking Number" variant="filled" value={matchingKit ? matchingKit.shipping_tracking_code : ''} />
        {matchingKit?.shipping_tracking_code && (<>
        <br/>
        <Link href={`https://www.fedex.com/apps/fedextrack/?action=track&trackingnumber=${matchingKit.shipping_tracking_code}`} target="_blank">View Tracking</Link>
        </>)}
      </Box>
    </Box>
  </Container>
}

export async function getServerSideProps() {
  //TODO: Move this to .env file based on where server is running
  const kitJSON = await fetcher('http://localhost:3000/api/kits');

  return {
    props: {
      suggestions: kitJSON.map(({ label_id }) => label_id)
    }
  }
}

/* TODO: An option for the future if using a trie would save us space (needs large data sets)
 also worthwhile for the speed of lookup */
// export async function getStaticProps(context) {
//   //TODO: Move this to .env file based on where server is running
//   const kitJSON = await fetcher('http://localhost:3000/api/kits');
//   const trie = new Trie();
//   console.log(kitJSON.map(({label_id}) => label_id).join('').length);
//   kitJSON.forEach( kit => {
//     trie.insert(kit.label_id)
//   })
//   trie.freeze();
//   console.log(trie.encode().length);
//   return {
//     props: {
//       suggestions: trie.encode()
//     }
//   }
// }

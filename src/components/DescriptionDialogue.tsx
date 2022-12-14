import { useState, useEffect, ReactNode } from "react";
import { WordMapping } from "../types";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import stringSimilarity from "string-similarity";


const SIMILARITY_THRESHOLD = 0.85;
const PUNCTUATION_PATTERN = /[^\w\s\']|_/g;
const WHITESPACE_PATTERN = /\s+/g;



function generateWordMappingMarkup(targetWord: string, keywordTokens : string[], mappingPairs : [string, string][], index : number)  {

  console.log("lol")
  const parsedTargetWord = targetWord.toLowerCase().replace(PUNCTUATION_PATTERN, "").replace(WHITESPACE_PATTERN, " ");

  for (const keywordToken of keywordTokens) {
      const parsedKeywordToken = keywordToken.toLowerCase().replace(PUNCTUATION_PATTERN, "").replace(WHITESPACE_PATTERN, " ");
      if (stringSimilarity.compareTwoStrings(parsedKeywordToken, parsedTargetWord) >= SIMILARITY_THRESHOLD) {
          return  <span key={index} style={{ backgroundColor : "yellow",  fontWeight: "bold" }}>{targetWord} </span>
      }

  } 

  for (const [word, mappings] of mappingPairs) {
    for (const mapping of mappings) {
      if (stringSimilarity.compareTwoStrings(mapping, parsedTargetWord) >= SIMILARITY_THRESHOLD && mapping.charAt(0) === parsedTargetWord.charAt(0)) {
        return <Tooltip key={index} title={`${word} relates to ${mapping}`} placement="top">
          <span style={{ color : "red", fontWeight: "bold" }}>{targetWord} </span>
        </Tooltip>
      }
    }

  }

  return `${targetWord} `

}


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2, marginRight : "30px" }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}



export default function DescriptionDialogue({ keywords, wordMapping, name, description }: { keywords : string, wordMapping: WordMapping, name: string, description: string }) {
  const [open, setOpen] = useState(false);
  const [mappingMarkups, setMappingMarkups] = useState<(string | JSX.Element)[]>([]);

  const descTokens = description.split(" ");
  const keywordTokens = keywords.split(" ");
  const mappingPairs = Object.entries(wordMapping);

  useEffect(() => {
    const markups = descTokens.map((token : string, index : number) => {
        return generateWordMappingMarkup(token, keywordTokens, mappingPairs, index);
      }
    );

    setMappingMarkups(markups);
  },[])

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Read synopsis 
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          {`Synopsis for ${name}`}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            {mappingMarkups}
          </Typography>

        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}
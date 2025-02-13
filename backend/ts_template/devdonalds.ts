import express, { Request, Response } from 'express';

// ==== Type Definitions, feel free to add or modify ==========================
interface cookbookEntry {
  name: string;
  type: string;
}

interface requiredItem {
  name: string;
  quantity: number;
}

interface recipe extends cookbookEntry {
  requiredItems: requiredItem[];
}

interface ingredient extends cookbookEntry {
  cookTime: number;
}

// =============================================================================
// ==== HTTP Endpoint Stubs ====================================================
// =============================================================================
const app = express();
app.use(express.json());

// Store your recipes here!
const cookbook: any = null;

// Task 1 helper (don't touch)
app.post("/parse", (req:Request, res:Response) => {
  const { input } = req.body;

  const parsed_string = parse_handwriting(input)
  if (parsed_string == null) {
    res.status(400).send("this string is cooked");
    return;
  } 
  res.json({ msg: parsed_string });
  return;
  
});

// [TASK 1] ====================================================================
// Takes in a recipeName and returns it in a form that 
const parse_handwriting = (recipeName: string): string | null => {

  // Check that input does not have length of > 0 characters
  if (recipeName.length <= 0) {
    return null;
  }

  // Remove leading and trailing whitespace
  recipeName.trimEnd();
  recipeName.trimStart();

  // Initialise array for modified name
  let newName: string = "";

  // First iteration: remove all hyphens, underscores and invalid characters
  for (let i: number = 0; i < recipeName.length; i++) {
    if (recipeName[i] === "-" || recipeName[i] === "_" || recipeName[i] === " ") {
      // Replace with space
      newName = newName + " ";
    } else if (/^[a-zA-Z]$/.test(recipeName[i]) == true) {
      // Check if character is letter
      newName = newName + recipeName[i];
    }
  }

  if (newName.length <= 0) {
    return null;
  }

  // Second iteration: remove extra spaces
  let newNameSecond: string = "";
  let isWord: boolean = false;

  for (let j: number = 0; j < newName.length; j++) {
    if (newName[j] !== " ") {
      if (isWord === false) {
        // First letter of word
        newNameSecond = newNameSecond + newName[j].toUpperCase();
        isWord = true;
      } else {
        // Remaining letters of word, convert to lowercase
        newNameSecond = newNameSecond + newName[j].toLowerCase();
      }
    } else if (isWord === true) {
      // Space reached, add one space only
      newNameSecond = newNameSecond + " ";
      isWord = false;
    }
  }

  // Remove trailing whitespace
  newNameSecond.trimEnd();

  return newNameSecond;
}

// [TASK 2] ====================================================================
// Endpoint that adds a CookbookEntry to your magical cookbook
app.post("/entry", (req:Request, res:Response) => {
  // TODO: implement me
  res.status(500).send("not yet implemented!")

});

// [TASK 3] ====================================================================
// Endpoint that returns a summary of a recipe that corresponds to a query name
app.get("/summary", (req:Request, res:Response) => {
  // TODO: implement me
  res.status(500).send("not yet implemented!")

});

// =============================================================================
// ==== DO NOT TOUCH ===========================================================
// =============================================================================
const port = 8080;
app.listen(port, () => {
  console.log(`Running on: http://127.0.0.1:8080`);
});

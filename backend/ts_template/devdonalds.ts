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
//const cookbook: any = null;
const cookbook: cookbookEntry[] = [];

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

  if (check_string(newName) === false) {
    return null;
  }

  // Second iteration: remove extra spaces, capitalise words
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

  if (check_string(newNameSecond) === false) {
    return null;
  }

  // Remove trailing whitespace
  newNameSecond.trimEnd();

  return newNameSecond;
}

// Helper function to check if resultant string becomes invalid
function check_string(input: string): boolean {
  if (input.length <= 0) {
    return false;
  }

  return true;
}

// [TASK 2] ====================================================================
// Endpoint that adds a CookbookEntry to your magical cookbook
app.post("/entry", (req:Request, res:Response) => {
  try {
    res.json(store_entry(req.body));
  } catch (error) {
    res.status(400).json({});
  }

});

// Stores cookbook entries
const store_entry = (entry: ingredient | recipe): {} => {
  // Type is not recipe or ingredient
  if (entry.type !== "recipe" && entry.type !== "ingredient") {
    throw new Error();
  }

  // Existing entry names not unique
  if (cookbook.find((existingEntry: cookbookEntry) => existingEntry.name === entry.name) !== undefined) {
    console.log("yes");
    throw new Error();
  }

  // cookTime <= 0
  if (entry.type === "ingredient") {
    const ingredientEntry = entry as ingredient;
    
    if (ingredientEntry.cookTime <= 0) {
      throw new Error();
    }
  }

  // requiredItems not unique
  if (entry.type === "recipe") {
    const recipeEntry = entry as recipe;

    for (let i: number = 0; i < recipeEntry.requiredItems.length; i++) {
      let counter: number = 0;

      for (let j: number = 0; j < recipeEntry.requiredItems.length; j++) {
        if (recipeEntry.requiredItems[j].name === recipeEntry.requiredItems[i].name) {
          counter++;
        }

        if (counter > 1) {
          throw new Error();
        }
      }
    }
  }

  cookbook.push(entry);

  return {};
}

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

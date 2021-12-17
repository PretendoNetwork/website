---
title: "Test"
author: "monty"
author_image: "https://www.github.com/ashmonty.png"
date: "January 20, 2038"
caption: "A post to test the styling of the various elements we might use (rename to _test.md before deploying the blog section)"
cover_image: "https://media.discordapp.net/attachments/413884110667251722/886474243662037062/image1.jpg"
---

A post to test the styling of the various elements we might use (rename to _test.md before deploying the blog section)

**bold**

[**bold url**](https://www.youtube.com/watch?v=HGoCNOFpWpo)

_italic_

[_italic url_](https://www.youtube.com/watch?v=HGoCNOFpWpo)

~strikethrough~

[~strikethrough url~](https://www.youtube.com/watch?v=HGoCNOFpWpo)

# h1

## h2

### h3

#### h4

##### h5

###### h6

---

| Element      | Description                                                                                                                                                        |
| :----------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| table        | The table HTML element represents tabular data — that is, information presented in a two-dimensional table comprised of rows and columns of cells containing data. |
| tuble        | The tuble HTML element represents tubular data — that is, information presented in a totally gnarly and radical way.                                               |
| table        | A table is an item of furniture with a flat top and one or more legs, used as a surface for working at, eating from or on which to place things.                   |

| Element      | Description                                                                                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| table        | The table HTML element represents tabular data — that is, information presented in a two-dimensional table comprised of rows and columns of cells containing data. |
| tuble        | The tuble HTML element represents tubular data — that is, information presented in a totally gnarly and radical way.                                               |
| table        | A table is an item of furniture with a flat top and one or more legs, used as a surface for working at, eating from or on which to place things.                   |

| Element      | Description                                                                                                                                                        |
| -----------: | -----------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| table        | The table HTML element represents tabular data — that is, information presented in a two-dimensional table comprised of rows and columns of cells containing data. |
| tuble        | The tuble HTML element represents tubular data — that is, information presented in a totally gnarly and radical way.                                               |
| table        | A table is an item of furniture with a flat top and one or more legs, used as a surface for working at, eating from or on which to place things.                   |

Yee haw 🤠

- list
- list
  - list
    - list
      - list

69. list
1. list
   1. list
      1. list
         1. list

- [ ] Unchecked checkbox
- [x] Checked checkbox

```js
class trueOrFalseObject {
  constructor(trueOrFalse) {
    this.trueOrFalse = trueOrFalse;
  }
  get trueOrFalse() {
    return this.trueOrFalse();
  }
  trueOrFalse() {
    return this.trueOrFalse;
  }
}

let objectWhichWeKnowIsTrue = new trueOrFalseObject(true);

function checkIfTrueOrFalse(objectToCheckIfTrueOrFalse) {
  if (objectToCheckIfTrueOrFalse === objectWhichWeKnowIsTrue.trueOrFalse) {
    return objectWhichWeKnowIsTrue.trueOrFalse;
    console.log(
      "Successfully checked if the object is true or false. Result: the object is true."
    );
    // For whatever reason this doesn't log, can't figure out why /s
  } else {
    objectWhichWeKnowIsTrue = new trueOrFalseObject(false);
    if (objectToCheckIfTrueOrFalse === objectWhichWeKnowIsTrue.trueOrFalse) {
      return objectWhichWeKnowIsTrue.trueOrFalse;
      console.log(
        "Successfully checked if the object is true or false. Result: the object is false."
      );
      // For whatever reason this doesn't log either, will probably ask on StackOverflow or something /s
    } else {
      // something went horribly wrong
    }
    objectWhichWeKnowIsTrue = new trueOrFalseObject(true);
  }
}

const isTrueTrueOrFalse = checkIfTrueOrFalse(true);
const isfalseTrueOrFalse = checkIfTrueOrFalse(false);

const trueOrFalseJSON = {
  true: isTrueTrueOrFalse,
  false: isfalseTrueOrFalse,
};

console.log(trueOrFalseJSON);

// Ok but seriously don't run this for the love of god I feel sorry for writing this even as a joke
```

> The blockquote HTML element indicates that the enclosed text is an extended quotation. Usually, this is rendered visually by indentation. A URL for the source of the quotation may be given using the cite attribute, while a text representation of the source can be given using the cite element.
> > The blockquote HTML element indicates that the enclosed text is an extended quotation. Usually, this is rendered visually by indentation. A URL for the source of the quotation may be given using the cite attribute, while a text representation of the source can be given using the cite element.
> > > The blockquote HTML element indicates that the enclosed text is an extended quotation. Usually, this is rendered visually by indentation. A URL for the source of the quotation may be given using the cite attribute, while a text representation of the source can be given using the cite element.

<cite>Adapted from [blockquote: The Block Quotation element, from MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/blockquote)</cite>

[yt-iframe](djV11Xbc914)

```[yt-iframe](djV11Xbc914)```

![test](https://media.discordapp.net/attachments/413884110667251722/886474243662037062/image1.jpg)

<video controls>
	<source src="https://cdn.discordapp.com/attachments/413884110667251722/878216238940160040/video0.mov">
</video>

Blogposts whose filename starts with a \_ will not show up on the /blogs page, but will still be accessible from the url (keep in mind that the file is still going to be publicly accessible on GitHub).

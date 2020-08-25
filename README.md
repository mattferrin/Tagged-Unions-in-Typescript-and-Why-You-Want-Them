# Tagged Unions in Typescript and Why You Want Them

## Why I Wrote This

I was once highly influenced by a language called Standard ML (SML). I learned about it in an online course I took immediately after finishing college. I've since loved F# and Rust, perhaps largely due to SML's influence on me.

I find myself programming in a way that might seem a bit different to some JavaScript developers. This article, is to some degree, me feeling the need to explain my differences. I can't blame SML, RUST, or F# fully for my style. All languages leave a lot of room to the developer to make choices. A Haskell or OCaml developer is more likely understand my code choices though, more so than a typical object-oriented developer.

## Motivation

The more vividly an application's types describe the data they represent, the more easily developers can refactor without violating truths about the data (i.e. breaking things). Also, the more the types help the developer to visibly write out all possible cases, the less likely it is that unhandled cases create bugs.

## Everyday Web Forms

For instance, it is impossible for a fetch request to be "uncalled", "loading", "error", and "data" all at the same time. A fetch is only 1 of the above at any given time. Setting loading to null or data to null while combining them together dilutes the truth. There's nothing preventing them from not being null when they should always be null.

Also, encouraging the developer to write "uncalled", "loading", "error", and "data" encourages the developer (and everyone who reads their code) to consider and handle all cases. Separating each of these cases decreases the number of combinations for invalid mixed states (i.e. is less bug prone).

## ReactJS Render

Please consider the following stripped down example of an address form that handles the result of fetching an already saved address. (Perhaps unidiomatic in JavaScript, but supported by the TypeScript type system.)

Do not worry about `addressFormLoading`, it will be shown later.

```ts
// switch must be final return to type-check that all cases are handled
switch (addressFetchResult.kind) {
  case "uncalled":
  case "loading":
    // pretend this is a beautiful skeleton
    return <AddressFormLoading />;
  case "error":
  case "data":
    return (
      <>
        {/* type must be narrowed to "error" or error message is inaccessible */}
        {addressFetchResult.kind === "error"
          ? addressFetchResult.message
          : null}

        <input value={addressFormLoading.addressLine1} />
        <input value={addressFormLoading.addressLine2} />
        <input value={addressFormLoading.city} />
        <input value={addressFormLoading.state} />
        <input value={addressFormLoading.zipCode} />

        <button>Submit</button>
      </>
    );
}
```

I want to pose common concerns that a developer might raise about the code in QA format.

### Q: But hey, "error" and "data" are mixed?

Yes, but separating them is encouraged, reducing risk. The more you combine things the more combinations you have to consider. The "error" state would be a little more bug prone if we had to more manually hide it during "loading".

### Q: Isn't accessing the message of the "error" more difficult?

Yes, but type safe. Further narrowing of error is required, guaranteeing it's there when the program expects it to be. It's essentially no more difficult than any forced null check.

### Q: This switch is verbose?

Yes, 'switch' is a longer word than 'if', but 'case' is not longer than 'else if'. Switch makes handling all possible cases easier. Visible but empty cases also remind the developer to handle them later if not today. I've had errors that display on the screen with little effort simply by handling all switch cases.

### Q: This "uncalled" is more complicated than it should be?

I've had situations where 1 "loading" thing depended on a prior "loading" thing. Not having "uncalled" on the second thing made it near impossible to hide the UI between distinct loading calls.

### Q: Isn't a `kind` that describes what type an object is at a given moment more complicated?

It's a sum type instead of a product type. Different isn't necessarily more complicated. In a sense, combining all separate states together at once is also more complicated.

### Q: Doesn't separating out the loading skeleton from the loaded form make it difficult to have a shared form field component, one that is either a skeleton element or a form element?

Yes. By design it encourages separation first, but it doesn't make it hard to combine "loading" and "data" like so:

```ts
const addressFormResponse = {
  loading: addressFetchResult.kind === "loading" ? addressFetchResult : null,
  dataddressFetchResult.kind === "data" ? addressFetchResult : null,
};
```

## Loading a Form

The React state `addressFormLoading` doesn't make sense in the top example without the context provided below.

```ts
// form state initially "loading", until result of fetch
const [addressFormLoading, setAddressFormLoading] = useState<
  Address | "loading"
>("loading");

// initialize form after fetch result
useEffect(() => {
  switch (addressFetchResult.kind) {
    case "uncalled":
    case "loading":
      // form remains "loading" until result of fetch
      return;
    case "error":
      // can still fill out blank form, despite "error" fetching it
      return setAddressFormLoading({
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipCode: "",
      });
    case "data":
      // form set with "data" from server
      return setAddressFormLoading(addressFetchResult.data);
  }
}, [addressFetchResult.kind]);
```

I don't feel the need to defend the code snippet above, other than to say it essentially forces a null check in a very readable way (like so):

```ts
// addressFormLoading properties can't be accessed unless "loading" is handled
if (addressFormLoading === "loading") {
  return <AddressFormLoading />;
}
```

## Ramble at the End

I love TypeScript, but it allows the developer to shoot themselves in the foot. Some TypeScript programs are hardly even typed. Lots of things are not expressions, forcing me to write code like `(() => {})()` simply to return a value inline. There's a certain amount of type-safety that comes from insuring that every input is the output of a previous step, without performing mutation. There's also a lot of type-safety that could be had if TypeScript disallowed returning void because my functions should explicitly handle all cases, and return a value to semi-prove they do.

F\* is an interesting research language. Project Everest is using F\* to potentially help prevent nightmare exploits in the HTTPS ecosystem. I haven't had the time to use it other than to say hello world yet.

Refinement types in F\* seem to allow automated proofs about pre, invariant, and post conditions of functions. With F\* you don't have to write proofs to do program verification, just use the type system to trick the compiler into doing it for you.

In my naive opinion, program verification could become an industry standard that exists alongside types and testing to insure quality software. (Give it a thousand years though.) In my lowly web developer life, I've never once experienced program verification using a proof assistant.

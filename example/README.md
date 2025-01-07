# Project Documentation

This guide explains how to implement start/stop verifier node.

---

## Implement Start Verifier Node
See the complete implementation in `src/sections/start-verifier-node-view.tsx`
Key functions include:

### 1. `handleStartNode`:
 This is the main function triggered by the button click. It orchestrates the process by calling two other functions: `createSetupVerifier()` and `handleDelegate()`.

### 2. `createSetupVerifier`: 
This function is responsible for setting up the verifier configuration. It constructs the `paramsSetupVerifier` object and calls the `NodeOperationService.createSetupVerifier` method.

### 3. `handleDelegate`: 
This function performs the following steps:
- Iterates over the number of licenses and encodes the delegation data using `encodeFunctionData`.
- Calls `refetchNodeInfos` to refresh node information.
- If the delegate is not active, it retrieves the node enter signature by calling `getNodeEnterSignature` and appends it to the encoded data.
- Calls `handleWriteContract` to execute the `multicall` function on the contract with the encoded data.

### 4. `getNodeEnterSignature`: 
- This function is called within `handleDelegate` if the delegate is not active. It retrieves the signature required for node entry by calling `NodeOperationService.getSignatureNodeEnter`.
- This sequence ensures that the verifier node is properly set up and the necessary delegations are executed when the "Start Node" button is clicked.

# Project Documentation

This guide explains how to implement start/stop verifier node.

---

# Implement Start Verifier Node
See the complete implementation in `src/sections/start-verifier-node-view.tsx`
Key functions include:

## 1. `handleStartVerifierNode`:
 This is the main function triggered by the button click. It orchestrates the process by calling two other functions: `createSetupVerifier()` and `handleDelegate()`.

## 2. `createSetupVerifier`: 
This function is responsible for setting up the verifier configuration. It constructs the `paramsSetupVerifier` object and calls the `NodeOperationService.createSetupVerifier` method.

## 3. `handleDelegate`: 
This function performs the following steps:
- Iterates over the number of licenses and encodes the delegation data using `encodeFunctionData`.
- Calls `refetchNodeInfos` to refresh node information.
- If the delegate is not active, it retrieves the node enter signature by calling `getNodeEnterSignature` and appends it to the encoded data.
- Calls `handleWriteContract` to execute the `multicall` function on the contract with the encoded data.

## 4. `getNodeEnterSignature`: 
- This function is called within `handleDelegate` if the delegate is not active. It retrieves the signature required for node entry by calling `NodeOperationService.getSignatureNodeEnter`.

## 5. Conclusion: 
This sequence ensures that the verifier node is properly set up and the necessary delegations are executed when the "Stop Verifier Node" button is clicked.

---

# Implement Stop Verifier Node
See the complete implementation in `src/sections/stop-verifier-node-view.tsx`
Key functions include:

## 1. `handleStopVerifierNode`:
 This is the main function triggered by the button click.  It manages the process of stopping the verifier node by performing the following actions:
- Iterates over the `licenseKeysAvailable` array to check each License Key's delegation status using the readContract function.
- If an License Key is delegated to the user's verifier wallet, it increments the `ownerDelegatedLicenseKey` counter and encodes the `undelegate` function call using `encodeFunctionData`, adding it to `encodeData`.
- Calls `handleWriteContract` to execute the `multicall` function on the contract with the encoded data.

## 2. Comparison and Conditional Call: 
- After iterating through the License Keys, it compares the number of License Keys the user has delegated (`ownerDelegatedLicenseKey`) with the `delegateWeightsData`.
- If the number of undelegated License Keys is less than the delegated ones, it calls `getNodeExitSignature` to get the signature for node exit and appends it to `encodeData`.

## 3. `getNodeExitSignature`: 
This function is called to obtain the signature required for the node exit process. It:
- Calls `NodeOperationService.getSignatureNodeExit` with the user's verifier wallet address.
-Encodes the `nodeExitWithSignature` function call with the retrieved signature data and returns it.

## 4. `handleWriteContract`:
Finally, the `handleWriteContract` function is called with the multicall function, passing the `encodeData` array. This executes the contract calls to undelegate License Keys and perform the node exit.

## 5. Conclusion: 
This sequence ensures that the verifier node is properly set up and the necessary delegations are executed when the "Stop Verifier Node" button is clicked.

/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getAuction } from "../graphql/queries";
import { updateAuction } from "../graphql/mutations";
const client = generateClient();
export default function AuctionUpdateForm(props) {
  const {
    id: idProp,
    auction: auctionModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    carName: "",
    player: "",
    buy: "",
    minBid: "",
    currentBid: "",
    endTime: "",
    status: "",
    lastBidPlayer: "",
  };
  const [carName, setCarName] = React.useState(initialValues.carName);
  const [player, setPlayer] = React.useState(initialValues.player);
  const [buy, setBuy] = React.useState(initialValues.buy);
  const [minBid, setMinBid] = React.useState(initialValues.minBid);
  const [currentBid, setCurrentBid] = React.useState(initialValues.currentBid);
  const [endTime, setEndTime] = React.useState(initialValues.endTime);
  const [status, setStatus] = React.useState(initialValues.status);
  const [lastBidPlayer, setLastBidPlayer] = React.useState(
    initialValues.lastBidPlayer
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = auctionRecord
      ? { ...initialValues, ...auctionRecord }
      : initialValues;
    setCarName(cleanValues.carName);
    setPlayer(cleanValues.player);
    setBuy(cleanValues.buy);
    setMinBid(cleanValues.minBid);
    setCurrentBid(cleanValues.currentBid);
    setEndTime(cleanValues.endTime);
    setStatus(cleanValues.status);
    setLastBidPlayer(cleanValues.lastBidPlayer);
    setErrors({});
  };
  const [auctionRecord, setAuctionRecord] = React.useState(auctionModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getAuction.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getAuction
        : auctionModelProp;
      setAuctionRecord(record);
    };
    queryData();
  }, [idProp, auctionModelProp]);
  React.useEffect(resetStateValues, [auctionRecord]);
  const validations = {
    carName: [{ type: "Required" }],
    player: [{ type: "Required" }],
    buy: [{ type: "Required" }],
    minBid: [{ type: "Required" }],
    currentBid: [],
    endTime: [{ type: "Required" }],
    status: [{ type: "Required" }],
    lastBidPlayer: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          carName,
          player,
          buy,
          minBid,
          currentBid: currentBid ?? null,
          endTime,
          status,
          lastBidPlayer: lastBidPlayer ?? null,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: updateAuction.replaceAll("__typename", ""),
            variables: {
              input: {
                id: auctionRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "AuctionUpdateForm")}
      {...rest}
    >
      <TextField
        label="Car name"
        isRequired={true}
        isReadOnly={false}
        value={carName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              carName: value,
              player,
              buy,
              minBid,
              currentBid,
              endTime,
              status,
              lastBidPlayer,
            };
            const result = onChange(modelFields);
            value = result?.carName ?? value;
          }
          if (errors.carName?.hasError) {
            runValidationTasks("carName", value);
          }
          setCarName(value);
        }}
        onBlur={() => runValidationTasks("carName", carName)}
        errorMessage={errors.carName?.errorMessage}
        hasError={errors.carName?.hasError}
        {...getOverrideProps(overrides, "carName")}
      ></TextField>
      <TextField
        label="Player"
        isRequired={true}
        isReadOnly={false}
        value={player}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              carName,
              player: value,
              buy,
              minBid,
              currentBid,
              endTime,
              status,
              lastBidPlayer,
            };
            const result = onChange(modelFields);
            value = result?.player ?? value;
          }
          if (errors.player?.hasError) {
            runValidationTasks("player", value);
          }
          setPlayer(value);
        }}
        onBlur={() => runValidationTasks("player", player)}
        errorMessage={errors.player?.errorMessage}
        hasError={errors.player?.hasError}
        {...getOverrideProps(overrides, "player")}
      ></TextField>
      <TextField
        label="Buy"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={buy}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              carName,
              player,
              buy: value,
              minBid,
              currentBid,
              endTime,
              status,
              lastBidPlayer,
            };
            const result = onChange(modelFields);
            value = result?.buy ?? value;
          }
          if (errors.buy?.hasError) {
            runValidationTasks("buy", value);
          }
          setBuy(value);
        }}
        onBlur={() => runValidationTasks("buy", buy)}
        errorMessage={errors.buy?.errorMessage}
        hasError={errors.buy?.hasError}
        {...getOverrideProps(overrides, "buy")}
      ></TextField>
      <TextField
        label="Min bid"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={minBid}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              carName,
              player,
              buy,
              minBid: value,
              currentBid,
              endTime,
              status,
              lastBidPlayer,
            };
            const result = onChange(modelFields);
            value = result?.minBid ?? value;
          }
          if (errors.minBid?.hasError) {
            runValidationTasks("minBid", value);
          }
          setMinBid(value);
        }}
        onBlur={() => runValidationTasks("minBid", minBid)}
        errorMessage={errors.minBid?.errorMessage}
        hasError={errors.minBid?.hasError}
        {...getOverrideProps(overrides, "minBid")}
      ></TextField>
      <TextField
        label="Current bid"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={currentBid}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              carName,
              player,
              buy,
              minBid,
              currentBid: value,
              endTime,
              status,
              lastBidPlayer,
            };
            const result = onChange(modelFields);
            value = result?.currentBid ?? value;
          }
          if (errors.currentBid?.hasError) {
            runValidationTasks("currentBid", value);
          }
          setCurrentBid(value);
        }}
        onBlur={() => runValidationTasks("currentBid", currentBid)}
        errorMessage={errors.currentBid?.errorMessage}
        hasError={errors.currentBid?.hasError}
        {...getOverrideProps(overrides, "currentBid")}
      ></TextField>
      <TextField
        label="End time"
        isRequired={true}
        isReadOnly={false}
        value={endTime}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              carName,
              player,
              buy,
              minBid,
              currentBid,
              endTime: value,
              status,
              lastBidPlayer,
            };
            const result = onChange(modelFields);
            value = result?.endTime ?? value;
          }
          if (errors.endTime?.hasError) {
            runValidationTasks("endTime", value);
          }
          setEndTime(value);
        }}
        onBlur={() => runValidationTasks("endTime", endTime)}
        errorMessage={errors.endTime?.errorMessage}
        hasError={errors.endTime?.hasError}
        {...getOverrideProps(overrides, "endTime")}
      ></TextField>
      <TextField
        label="Status"
        isRequired={true}
        isReadOnly={false}
        value={status}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              carName,
              player,
              buy,
              minBid,
              currentBid,
              endTime,
              status: value,
              lastBidPlayer,
            };
            const result = onChange(modelFields);
            value = result?.status ?? value;
          }
          if (errors.status?.hasError) {
            runValidationTasks("status", value);
          }
          setStatus(value);
        }}
        onBlur={() => runValidationTasks("status", status)}
        errorMessage={errors.status?.errorMessage}
        hasError={errors.status?.hasError}
        {...getOverrideProps(overrides, "status")}
      ></TextField>
      <TextField
        label="Last bid player"
        isRequired={false}
        isReadOnly={false}
        value={lastBidPlayer}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              carName,
              player,
              buy,
              minBid,
              currentBid,
              endTime,
              status,
              lastBidPlayer: value,
            };
            const result = onChange(modelFields);
            value = result?.lastBidPlayer ?? value;
          }
          if (errors.lastBidPlayer?.hasError) {
            runValidationTasks("lastBidPlayer", value);
          }
          setLastBidPlayer(value);
        }}
        onBlur={() => runValidationTasks("lastBidPlayer", lastBidPlayer)}
        errorMessage={errors.lastBidPlayer?.errorMessage}
        hasError={errors.lastBidPlayer?.hasError}
        {...getOverrideProps(overrides, "lastBidPlayer")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || auctionModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || auctionModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}

port module Payments exposing (main)

import Browser
import Html exposing (Html)
import Html.Attributes as A
import Http
import Json.Decode as Decode
import Json.Decode.Pipeline as DP
import Json.Encode as Encode



-- Model


type alias Model =
    { state : State
    , serverAwake : ServerStatus
    }


type ServerStatus
    = Awake
    | Trying Int
    | GaveUp


type State
    = WaitingForForm
    | WaitingForStripeToken
    | BadInputData String
    | WaitingForServer
    | Complete
    | Failed Http.Error


type alias FormData =
    { name : String
    , amount : String
    , email : String
    , fund : String
    , result : StripeResult
    }


formDataDecoder : Decode.Decoder FormData
formDataDecoder =
    Decode.succeed FormData
        |> DP.required "name" Decode.string
        |> DP.required "amount" Decode.string
        |> DP.required "email" Decode.string
        |> DP.required "fund" Decode.string
        |> DP.required "result" stripeResultDecoder


type alias StripeResult =
    { token : Maybe StripeToken
    , error : Maybe StripeError
    }


stripeResultDecoder : Decode.Decoder StripeResult
stripeResultDecoder =
    Decode.succeed StripeResult
        |> DP.optional "token" (Decode.maybe stripeTokenDecoder) Nothing
        |> DP.optional "error" (Decode.maybe stripeErrorDecoder) Nothing


type alias StripeToken =
    { id : String }


stripeTokenDecoder : Decode.Decoder StripeToken
stripeTokenDecoder =
    Decode.succeed StripeToken
        |> DP.required "id" Decode.string


type alias StripeError =
    { charge : String
    , message : Maybe String
    , code : Maybe String
    , declineCode : Maybe String
    , param : Maybe String
    }


stripeErrorDecoder : Decode.Decoder StripeError
stripeErrorDecoder =
    Decode.succeed StripeError
        |> DP.required "charge" Decode.string
        |> DP.optional "message" (Decode.maybe Decode.string) Nothing
        |> DP.optional "code" (Decode.maybe Decode.string) Nothing
        |> DP.optional "declineCode" (Decode.maybe Decode.string) Nothing
        |> DP.optional "param" (Decode.maybe Decode.string) Nothing



-- Update


type Msg
    = ServerResponseReceived (Result Http.Error String)
    | WakeUpResponseReceived (Result Http.Error String)
    | FromJs Encode.Value
    | WaitForStripeToken


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        FromJs json ->
            case Decode.decodeValue formDataDecoder json of
                Ok rawFormData ->
                    case String.toFloat rawFormData.amount of
                        Just amount ->
                            case rawFormData.result.token of
                                Nothing ->
                                    ( { model | state = BadInputData <| Maybe.withDefault "Unknown Error" <| Maybe.andThen .message rawFormData.result.error }, Cmd.none )

                                Just token ->
                                    ( { model | state = WaitingForServer }, makeCharge (chargeBody amount token.id rawFormData) )

                        Nothing ->
                            ( { model | state = BadInputData (niceAmountErrorMsg rawFormData.amount) }, Cmd.none )

                Err err ->
                    ( { model | state = BadInputData <| Decode.errorToString err }, Cmd.none )

        ServerResponseReceived (Ok _) ->
            ( { model | state = Complete }, Cmd.none )

        ServerResponseReceived (Err err) ->
            ( { model | state = Failed err }, Cmd.none )

        WakeUpResponseReceived (Ok _) ->
            ( { model | serverAwake = Awake }, Cmd.none )

        WakeUpResponseReceived (Err _) ->
            case model.serverAwake of
                Awake ->
                    ( { model | serverAwake = Trying 0 }, Cmd.none )

                Trying times ->
                    if times < 10 then
                        ( { model | serverAwake = Trying <| times + 1 }, wakeUpHeroku )

                    else
                        ( { model | serverAwake = GaveUp }, Cmd.none )

                GaveUp ->
                    ( model, Cmd.none )

        WaitForStripeToken ->
            ( { model | state = WaitingForStripeToken }, Cmd.none )


niceAmountErrorMsg : String -> String
niceAmountErrorMsg amount =
    case amount of
        "" ->
            "You need to provide how much you would like to give."

        _ ->
            "\"" ++ amount ++ "\" is not a valid number."



-- Subscriptions


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ stripeResult FromJs
        , startLoading (\_ -> WaitForStripeToken)
        ]



-- Ports


port stripeResult : (Encode.Value -> msg) -> Sub msg


port startLoading : (() -> msg) -> Sub msg



-- View


view : Model -> Html Msg
view model =
    case model.state of
        WaitingForForm ->
            Html.text ""

        WaitingForStripeToken ->
            Html.div [ A.class "" ]
                [ Html.text "Processing..."
                ]

        BadInputData rawErr ->
            Html.div [ A.class "alert alert-danger" ]
                [ Html.p [] [ Html.text "Uh oh, something went wrong there." ]
                , Html.p [] [ Html.text "The issue happened before we tried to charge your card." ]
                , Html.p [] [ Html.text "Please refresh this page and try again." ]
                , Html.br [] []
                , Html.div [ A.class "" ]
                    [ Html.p [] [ Html.text "Error:" ]
                    , Html.p [] [ Html.text rawErr ]
                    ]
                ]

        WaitingForServer ->
            Html.div [ A.class "" ]
                [ Html.text "Processing..."
                ]

        Complete ->
            Html.div [ A.class "alert alert-success" ]
                [ Html.text "Thank you for your donation!" ]

        Failed rawErr ->
            Html.div [ A.class "alert alert-danger" ]
                ([ Html.p [] [ Html.text "Uh oh, something went wrong there." ]
                 , Html.p [] [ Html.text "The issue happened as we were trying to charge your card:" ]
                 ]
                    ++ niceHttpErr rawErr
                )


niceHttpErr : Http.Error -> List (Html msg)
niceHttpErr err =
    case err of
        Http.BadUrl _ ->
            [ Html.p [] [ Html.text "Server error, your card should not have been charged, but please contact the office to make sure before trying again." ] ]

        Http.Timeout ->
            [ Html.p [] [ Html.text "Request timed out (it took too long)." ]
            , Html.p [] [ Html.text "I do not know if your card was charged successfully, please contact the office and we will happily check for you." ]
            ]

        Http.NetworkError ->
            [ Html.p [] [ Html.text "There was a network error, maybe your internet dropped out?" ]
            , Html.p [] [ Html.text "I do not know if your card was charged successfully, please contact the office and we will happily check for you." ]
            ]

        Http.BadStatus resp ->
            [ Html.p [] [ Html.text "The error message provided by our payments provider (Stripe) was:" ]
            , Html.pre [] [ Html.text resp.body ]
            ]

        Http.BadPayload _ _ ->
            [ Html.p [] [ Html.text "Server error, your card should not have been charged, but please contact the office to make sure before trying again." ] ]



-- Main


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { state = WaitingForForm
      , serverAwake = Trying 0
      }
    , wakeUpHeroku
    )


wakeUpHeroku : Cmd Msg
wakeUpHeroku =
    Http.getString "https://stcs-pay.herokuapp.com"
        |> Http.send WakeUpResponseReceived


chargeBody : Float -> String -> FormData -> Http.Body
chargeBody amount token data =
    Encode.object
        [ ( "name", Encode.string data.name )
        , ( "email", Encode.string data.email )
        , ( "fund", Encode.string data.fund )
        , ( "token", Encode.string token )
        , ( "amount", Encode.int <| round <| amount * 100 )
        ]
        |> Http.jsonBody


makeCharge : Http.Body -> Cmd Msg
makeCharge body =
    Http.request
        { method = "POST"
        , headers = []
        , url = "https://stcs-pay.herokuapp.com"
        , body = body
        , expect = Http.expectString
        , timeout = Nothing
        , withCredentials = False
        }
        |> Http.send ServerResponseReceived
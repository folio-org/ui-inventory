import {
  interactor,
  text,
} from '@bigtest/interactor';

export default @interactor class InvSettingsInteractor {
  titleAlternative = text('#alternative-title-types [class^=headline--]');
  titleClassificationTypes = text('#classification-types [class^=headline--]');
  titleContributorTypes = text('#contributor-types [class^=headline--]');
  titleFormats = text('#formats [class^=headline--]');
  titleInstanceNoteTypes = text('#instanceNoteTypes [class^=headline--]');
  titleInstanceStatusTypes = text('#instanceStatus-types [class^=headline--]');
  titleModeOfInssuance = text('#modes-of-issuance [class^=headline--]');
  titleNatureOfContent = text('#natureOfContentTerms [class^=headline--]');
  titleResourceIdentifierTypes = text('#identifier-types [class^=headline--]');
  titleInstanceResourceTypes = text('#instance-types [class^=headline--]');

  titleHoldingsNoteTypes = text('#holdingsNoteTypes [class^=headline--]');
  titleHoldingsTypes = text('#holdingsTypes [class^=headline--]');
  titleHoldingsIllPolicy = text('#ILLPolicy [class^=headline--]');

  titleItemsNoteTypes = text('#itemNoteTypes [class^=headline--]');
  titleItemsLoanTypes = text('#loan-types [class^=headline--]');
  titleItemsMaterialTypes = text('#materialtypes [class^=headline--]');

  titleStaticticalCodeTypes = text('#StatisticalCodeTypes [class^=headline--]');
  titleStaticticalCodes = text('#statistical-codes [class^=headline--]');
  titleUrlRelationship = text('#electronicAccessRelationships [class^=headline--]');
  titleCallNumberTypes = text('#callNumberTypes [class^=headline--]');
}

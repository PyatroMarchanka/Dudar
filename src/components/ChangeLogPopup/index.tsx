import { theme } from "../../utils/theme";
import { Icon } from "../global/Icon";
import Modal from "../global/Modal";
import InfoIcon from "@material-ui/icons/Info";
interface Props {}

const ChangeLogPopup = (props: Props) => {
  const Button = <Icon type="material" fill={theme.colors.black} Icon={InfoIcon} />
  
  return (
    <div>
      <Modal triggerComponent={Button} title="About">
        content
      </Modal>
    </div>
  );
};

export default ChangeLogPopup;

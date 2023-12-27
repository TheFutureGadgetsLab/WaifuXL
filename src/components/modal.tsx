'use client';
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select } from "@mui/material";
import { useAppStateStore, useImageStore } from '../services/useState'
import { getDataURIFromInput, setDataURIFromFile } from '@/services/imageUtilities'


export default function ModalComponent() {
    const { inputModalOpen, setInputModalOpen } = useAppStateStore()
    const { selectedPreset, setSelectedPreset } = useAppStateStore()
    const { setTempURI, setTempFileName, tempURI, setInputURI, setTags, inputURI } = useImageStore()

    return (
        <Modal
            open={inputModalOpen}
            onClose={() => {
                setInputModalOpen(false)
                setTempURI(inputURI)
                setSelectedPreset('')
            }}
        >
            <Box sx={{
                position: 'absolute' as 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
            }}>
                <Box
                    component="label"
                    style={{
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginBottom: 10,
                        width: "auto",
                        height: "24rem",
                        backgroundImage: `url(${tempURI})`,
                        background: "no-repeat",
                        boxShadow: 'inset 0px 0px 12px #00000050',
                        backgroundOrigin: "content-box",
                        backgroundSize: "cover",
                        cursor: "pointer",
                    }}
                >
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onInput={(e) => {
                            let inp = e.target as HTMLInputElement;
                            if (inp.files && inp.files[0]) {
                                setDataURIFromFile(inp.files[0], setTempURI)
                                setTempFileName(inp.files[0].name.split('.')[0])
                                setSelectedPreset('')
                            }
                        }}
                    />

                </Box>
                <FormControl color="success" sx={{ minWidth: 200, marginBottom: 2 }} fullWidth>
                    <InputLabel>Preset</InputLabel>
                    <Select
                        color="success"
                        value={selectedPreset}
                        label="Preset"
                        onChange={inp => {
                            setSelectedPreset(inp.target.value)
                            const [name, url] = inp.target.value.split('|')
                            getDataURIFromInput(url).then((uri) => setTempURI(uri))
                            setTempFileName(`example_${name}`)
                        }}
                    >
                        <MenuItem color="success" value="ozen|https://i.imgur.com/Sf6sfPj.png">Ozen</MenuItem>
                        <MenuItem color="success" value="eat|https://c.tenor.com/rnhV3fu39f8AAAAM/eating-anime.gif">Eating (GIF)</MenuItem>
                        <MenuItem color="success" value="senjougahara|https://i.imgur.com/cMX8YcK.jpg">Senjougahara</MenuItem>
                        <MenuItem color="success" value="moomin|https://i.imgur.com/9I91yMq.png">Moomin</MenuItem>
                        <MenuItem color="success" value="megumin|https://i.imgur.com/BKBt6bC.png">Megumin</MenuItem>
                        <MenuItem color="success" value="aqua|https://i.imgur.com/yhIwVjZ.jpeg">Aqua</MenuItem>
                        <MenuItem color="success" value="natsumi|https://i.imgur.com/yIIl7Z1.png">Kurobe Natsumi</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    component="label"
                    key="ModalUpload"
                    variant="contained"
                    size="large"
                    sx={{ color: '#fff', marginRight: 2 }}
                    color="success"

                >
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onInput={(e) => {
                            let inp = e.target as HTMLInputElement;
                            if (inp.files && inp.files[0]) {
                                setDataURIFromFile(inp.files[0], setTempURI)
                                setTempFileName(inp.files[0].name.split('.')[0])
                                setSelectedPreset('')
                            }
                        }}
                    />
                    Upload
                </Button>
                <Button
                    key="ModalDone"
                    onClick={() => {
                        setInputURI(tempURI)
                        setTags(null)
                        setInputModalOpen(false)
                        setSelectedPreset('')
                    }}
                    variant="outlined"
                    size="large"
                    sx={{ float: 'right', marginLeft: 2 }}
                    color="success"
                >
                    Done
                </Button>
            </Box>
        </Modal>
    )
}
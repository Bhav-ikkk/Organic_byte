"use client"

import { useState } from "react"
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Typography } from "@mui/material"
import { Language as LanguageIcon, Check as CheckIcon } from "@mui/icons-material"
import { useTranslation } from "react-i18next"

const languages = [
  {
    code: "en",
    name: "English",
    flag: "🇺🇸",
  },
  {
    code: "hi",
    name: "हिंदी",
    flag: "🇮🇳",
  },
]

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode)
    handleClose()
  }

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0]

  return (
    <>
      <IconButton
        onClick={handleClick}
        color="inherit"
        aria-label="change language"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1,
        }}
      >
        <Typography variant="body2" sx={{ fontSize: "1.2rem" }}>
          {currentLanguage.flag}
        </Typography>
        <LanguageIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 180,
            borderRadius: 2,
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          },
        }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            selected={i18n.language === language.code}
            sx={{
              py: 1.5,
              px: 2,
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
                {language.flag}
              </Typography>
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500}>
                {language.name}
              </Typography>
            </ListItemText>
            {i18n.language === language.code && <CheckIcon color="primary" sx={{ ml: 1 }} />}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

use enum_map::{Enum, EnumMap};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Enum)]
pub enum FactionId {
    Kit,
    Caylion,
    Kjas,
    Faderan,
    Imdril,
    Eniet,
    Unity,
    Yengii,
    Zeth,
}

pub use FactionId::*;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum FactionType {
    Base,
    Expansion,
}

/// The various ways that a faction can be referred to
#[derive(Debug, Clone, Copy)]
pub struct FactionNames {
    /// The name of the faction that is common to both the base game and
    /// expansion
    pub common: &'static str,

    /// The full name of the base game version of the faction
    pub base: &'static str,

    /// The full name of the Bifurcation version of the faction
    pub expansion: &'static str,

    /// The quick shorthand name for the faction
    pub shorthand: &'static str,
}

impl FactionNames {
    pub fn full_name(&self, kind: FactionType) -> &'static str {
        match kind {
            FactionType::Base => self.base,
            FactionType::Expansion => self.expansion,
        }
    }
}

macro_rules! faction_shorthand {
    ($common:literal) => {
        $common
    };
    ($shorthand:literal $common:literal) => {
        $shorthand
    };
}

macro_rules! faction_name {
    (
        $common:literal; $expansion:literal $(aka $shorthand:literal)?
    ) => {
        FactionNames {
            common: $common,
            base: $common,
            expansion: $expansion,
            shorthand: faction_shorthand!($($shorthand)? $common),
        }
    };

    (
        $common:literal
        $base_suffix:literal/$expansion_suffix:literal
        $(aka $shorthand:literal)?
    ) => {
        FactionNames {
            common: $common,
            base: concat!($common, " ", $base_suffix),
            expansion: concat!($common, " ", $expansion_suffix),
            shorthand: faction_shorthand!($($shorthand)? $common),
        }
    };

    (
        $common:literal
        $base_suffix:literal; $expansion:literal
        $(aka $shorthand:literal)?
    ) => {
        FactionNames {
            common: $common,
            base: concat!($common, " ", $base_suffix),
            expansion: $expansion,
            shorthand: faction_shorthand!($($shorthand)? $common),
        }
    };
}

pub static ALL_FACTIONS: EnumMap<FactionId, FactionNames> = EnumMap::from_array([
    faction_name!("Kt'zr'kt'rtl" "Adhocracy"/"Technophiles" aka "Kit"),
    faction_name!("Caylion" "Plutocracy"/"Collaborative"),
    faction_name!("Kjasjavikalimm" "Directorate"/"Independent Nations" aka "Kjas"),
    faction_name!("Faderan" "Conclave"; "Society of Falling Light"),
    faction_name!("Im'dril" "Nomads"; "Grand Fleet"),
    faction_name!("Eni Et" "Ascendancy"/"Engineers"),
    faction_name!("Unity"; "Deep Unity"),
    faction_name!("Yengii" "Society"/"Jii"),
    faction_name!("Zeth" "Anocracy"; "Charity Syndicate"),
]);

pub fn faction_names(faction: FactionId) -> &'static FactionNames {
    &ALL_FACTIONS[faction]
}

pub enum RoundId {
    One,
    Two,
    Three,
    Four,
    Five,
    Six,
}


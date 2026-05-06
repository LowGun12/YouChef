namespace UCook.Application.DTOs;

public record UserPreferencesDto(
    List<string> Allergies,
    List<string> Dietary,
    List<string> CuisinePrefs,
    bool OnboardingComplete
);

public record SavePreferencesRequest(
    List<string> Allergies,
    List<string> Dietary,
    List<string> CuisinePrefs
);
